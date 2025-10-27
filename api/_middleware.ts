import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory rate limiting store
// In production, consider using Redis or Vercel KV for distributed rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean; // Don't count successful requests
}

const rateLimitConfigs: Record<string, RateLimitConfig> = {
  // Strict limits for sensitive endpoints
  'verify-guess': { windowMs: 60 * 1000, maxRequests: 30 }, // 30 requests per minute
  'submit-score': { windowMs: 60 * 1000, maxRequests: 5 }, // 5 requests per minute
  'start-quiz-session': { windowMs: 60 * 1000, maxRequests: 10 }, // 10 requests per minute
  'save-quiz-progress': { windowMs: 60 * 1000, maxRequests: 60 }, // 60 requests per minute (more frequent updates)
  
  // Moderate limits for general endpoints
  'get-leaderboard': { windowMs: 60 * 1000, maxRequests: 20 }, // 20 requests per minute
  'check-daily-completion': { windowMs: 60 * 1000, maxRequests: 20 }, // 20 requests per minute
  'get-quiz-metadata': { windowMs: 60 * 1000, maxRequests: 30 }, // 30 requests per minute
  
  // Admin endpoint - very strict
  'reset-leaderboard': { windowMs: 60 * 1000, maxRequests: 2 }, // 2 requests per minute
};

function getClientIdentifier(req: VercelRequest): string {
  // Use IP address as primary identifier
  const ip = req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] || 
             req.connection?.remoteAddress || 
             'unknown';
  
  // For authenticated requests, also include user ID for more granular limiting
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // Extract user ID from JWT token (simplified - in production use proper JWT parsing)
    try {
      const token = authHeader.replace('Bearer ', '');
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      return `${ip}-${payload.sub}`;
    } catch {
      // If token parsing fails, fall back to IP only
      return ip as string;
    }
  }
  
  return ip as string;
}

function isRateLimited(identifier: string, endpoint: string): boolean {
  const config = rateLimitConfigs[endpoint];
  if (!config) return false; // No rate limiting for unknown endpoints
  
  const now = Date.now();
  const key = `${identifier}-${endpoint}`;
  const record = rateLimitStore.get(key);
  
  // Clean up expired records
  if (record && now > record.resetTime) {
    rateLimitStore.delete(key);
  }
  
  // Check if limit exceeded
  if (record && now <= record.resetTime) {
    if (record.count >= config.maxRequests) {
      return true; // Rate limited
    }
    record.count++;
  } else {
    // Create new record
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    });
  }
  
  return false;
}

function cleanupExpiredRecords(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up expired records every 5 minutes
setInterval(cleanupExpiredRecords, 5 * 60 * 1000);

export function withRateLimit(endpoint: string) {
  return function(handler: (req: VercelRequest, res: VercelResponse) => Promise<any>) {
    return async function(req: VercelRequest, res: VercelResponse) {
      const identifier = getClientIdentifier(req);
      
      if (isRateLimited(identifier, endpoint)) {
        res.setHeader('X-RateLimit-Limit', rateLimitConfigs[endpoint]?.maxRequests || 0);
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader('X-RateLimit-Reset', new Date(Date.now() + (rateLimitConfigs[endpoint]?.windowMs || 60000)).toISOString());
        
        return res.status(429).json({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${Math.ceil((rateLimitConfigs[endpoint]?.windowMs || 60000) / 1000)} seconds.`,
          retryAfter: Math.ceil((rateLimitConfigs[endpoint]?.windowMs || 60000) / 1000)
        });
      }
      
      // Add rate limit headers to successful responses
      const config = rateLimitConfigs[endpoint];
      if (config) {
        const key = `${identifier}-${endpoint}`;
        const record = rateLimitStore.get(key);
        const remaining = record ? Math.max(0, config.maxRequests - record.count) : config.maxRequests - 1;
        
        res.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
        res.setHeader('X-RateLimit-Remaining', remaining.toString());
        res.setHeader('X-RateLimit-Reset', new Date(Date.now() + config.windowMs).toISOString());
      }
      
      return handler(req, res);
    };
  };
}
