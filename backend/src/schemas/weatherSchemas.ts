import Joi from "joi";

export const weatherQuerySchema = Joi.object({
  city: Joi.string().trim().min(1).required(),
});

export const forecastQuerySchema = weatherQuerySchema;
