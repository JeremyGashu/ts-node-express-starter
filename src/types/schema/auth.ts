import Joi from 'joi';

export const SUserLoginSchema = Joi.object().keys({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(8).required(),
});
