// CORS configuration for API endpoints
const ALLOWED_ORIGINS = [
  'http://localhost:8080',     // Development
  'http://localhost:3000',     // Development alternative
  'https://bukets.net',        // Production domain
  'https://www.bukets.net',    // Production with www
];

// Environment-based CORS configuration
export function getAllowedOrigins(): string[] {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'development') {
    return [
      'http://localhost:8080',
      'http://localhost:3000',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:3000',
    ];
  }
  
  // Production - only allow your actual domain
  return [
    'https://bukets.net',        // Production domain
    'https://www.bukets.net',    // Production with www
    'https://bukets.vercel.app', // Vercel deployment URL
  ];
}

export function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;
  
  const allowedOrigins = getAllowedOrigins();
  return allowedOrigins.includes(origin);
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
