import { Response, NextFunction } from 'express';
import { IPaginatedRequest } from '../types/typedef/pagination';

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
