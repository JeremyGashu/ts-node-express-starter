import { Request } from 'express';
/**
 * @description Request object on top of express.Request which
 * will contain [page] and [limit] parameters.
 * We will use them in paginated queries.
 */
export interface IPaginatedRequest extends Request {
  page: number;
  limit: number;
}
