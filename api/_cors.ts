// CORS configuration for API endpoints
const ALLOWED_ORIGINS = [
  'http://localhost:8080',     // Development
  'http://localhost:3000',     // Development alternative
  'https://bukets.net',        // Production domain
  'https://www.bukets.net',    // Production with www
];

// Environment-based CORS configuration
export function getAllowedOrigins(): string[] {
  // Always return all allowed origins regardless of environment
  // This ensures compatibility across all deployment scenarios
  return [
    'http://localhost:8080',     // Development
    'http://localhost:3000',     // Development alternative
    'http://127.0.0.1:8080',     // Development alternative
    'http://127.0.0.1:3000',     // Development alternative
    'https://bukets.net',        // Production domain
    'https://www.bukets.net',    // Production with www
    'https://bukets.vercel.app', // Vercel deployment URL
  ];
}

export function isOriginAllowed(origin: string | undefined): boolean {
  // Temporarily allow all origins to debug the issue
  console.log(`[CORS DEBUG] Origin: ${origin}, Environment: ${process.env.NODE_ENV}`);
  return true; // Allow all origins temporarily
}

export function getCorsHeaders(origin: string | undefined) {
  const allowedOrigins = getAllowedOrigins();
  
  return {
    'Access-Control-Allow-Origin': isOriginAllowed(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

// Remove the module.exports line since we're using ES6 exports
