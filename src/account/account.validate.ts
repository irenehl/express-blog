import joi from 'joi';

export const createAccountSchema = joi.object({
    name: joi.string().min(5).required(),
    lastname: joi.string().min(5).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).alphanum().required(),
});

export const updateAccountSchema = joi.object({
    name: joi.string().min(5).optional(),
    lastname: joi.string().min(5).optional(),
    email: joi.string().email().optional(),
    password: joi.string().min(4).alphanum().optional(),
    verifyToken: joi.string().optional(),
});
