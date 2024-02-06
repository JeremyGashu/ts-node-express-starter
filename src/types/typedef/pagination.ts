import { Request } from 'express';
export interface IPaginatedRequest extends Request {
  page: number;
  limit: number;
}
