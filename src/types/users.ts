import Joi from "joi"

export const SUserSchema = Joi.object().keys({
    name:Joi.string().trim().required(),
    age: Joi.number().integer().min(0).max(100).required(),
    email: Joi.string().trim().email().required(),
})