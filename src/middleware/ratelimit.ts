import rateLimit from 'express-rate-limit';

/**
 * Rate limiting middleware, which will block the user if
 * the user sends more than 20 requests/minute.
 */
export const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: 'You have exceeded your 20 requests per minute limit.',
  headers: true,
});
