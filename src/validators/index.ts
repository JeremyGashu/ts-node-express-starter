import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export class TypeValidator<T> {
  validate = (schema: Joi.ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const val = await schema.validateAsync(req.body);
        // req.body = val as AddFormToJobType;
        req.body = val as T;
        next();
      } catch (err) {
        const messages = (err as Joi.ValidationError)?.details
          .map((i) => i.message)
          .join(',');

        res.status(422).json({
          success: false,
          errors: [messages],
        });
      }
    };
  };
}
