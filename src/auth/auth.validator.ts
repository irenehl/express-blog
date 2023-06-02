import joi from 'joi';

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).alphanum().required(),
});

export const emailSchema = joi.object({
    email: joi.string().email().required(),
});

export const resetPasswordSchema = joi.object({
    password: joi.string().min(4).alphanum().required(),
});
