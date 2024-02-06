import Joi from 'joi';

export const SUserCreateSchema = Joi.object().keys({
  name: Joi.string().trim().required(),
  age: Joi.number().integer().min(0).max(100).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(8).required(),
});

export const SUserUpdateSchema = Joi.object().keys({
  name: Joi.string().trim(),
  age: Joi.number().integer().min(0).max(100),
  email: Joi.string().trim().email(),
  password: Joi.string().trim().email().min(8),
});
