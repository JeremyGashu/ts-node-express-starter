import { Response, NextFunction } from 'express';
import { IPaginatedRequest } from '../types/typedef/pagination';

/**
 * Checks page and limit query params of a given request and
 * sends it to the next request handler middleware.
 * @param req - page, limit added express Request object
 * @param _res - express response object
 * @param next - next function handler
 * @returns - void
 */
export const isPaginated = (
  req: IPaginatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const { limit, page } = req.query;
  const parsedLimit = Math.abs(Number(limit) || 10);
  const parsedPage = Math.abs(Number(page) || 1);
  req.page = parsedPage;
  req.limit = parsedLimit;
  return next();
};
