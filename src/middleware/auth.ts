import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';

/**
 * Checks if the request sender is an authenticated user.
 * @param req - express Request object
 * @param res - express Response object
 * @param next - express NextFunction handler
 * @returns void
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      errors: ['🚫 Un-Authorized 🚫'],
    });
  }

  try {
    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;
    // req.payload = payload;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(401);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        errors: ['🚫 Token expired! 🚫'],
      });
    }
    return res.status(401).json({
      success: false,
      errors: ['🚫 Un-Authorized 🚫'],
    });
  }

  return next();
};
