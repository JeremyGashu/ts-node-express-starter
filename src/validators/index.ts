import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export class TypeValidator<T> {
  validate = (schema: Joi.ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const val = await schema.validateAsync(req.body);
        console.log("Current val", val);
        // req.body = val as AddFormToJobType;
        req.body = val as T;
        next();
      } catch (err) {
        const messages = (err as Joi.ValidationError)?.details
          .map((i) => i.message)
          .join(",");

        res.status(422).json({
          success: false,
          errors: [messages],
        });
      }
    };
  };
}

// export const jobUpdateSchema = Joi.object().keys({
//   title: Joi.string().trim(),
//   email: Joi.string().email(),
//   closingDate: Joi.date(),
//   description: Joi.string().trim(),
//   salary: Joi.number(),
//   companyId: Joi.string().trim(),
//   currency: Joi.string().valid("USD", "ETB"),
//   benefits: Joi.string().trim(),
//   experienceNeeded: Joi.number().min(0),
//   region: Joi.string().trim(),
//   city: Joi.string().trim(),
//   internalCode: Joi.string().trim(),
//   quantity: Joi.number().min(0),
//   status: Joi.string(),

// });
