import joi from 'joi';

export const createPostSchema = joi.object({
    content: joi.string().required(),
    status: joi.string().optional(),
});

export const updatePostSchema = joi.object({
    content: joi.string().optional(),
    status: joi.string().optional(),
});

export const reportPostSchema = joi.object({
    description: joi.string().required(),
    author: joi.optional(),
});
