import joi from 'joi';

export const loginSchema = joi.object({
    email: joi.string().min(5).required(),
    password: joi.string().required(),
});
