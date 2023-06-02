import joi from 'joi';

export const createCommentSchema = joi.object({
    content: joi.string().required(),
    status: joi.string().optional(),
});

export const updateCommentSchema = joi.object({
    content: joi.string().optional(),
    status: joi.string().optional(),
});

export const reportCommentSchema = joi.object({
    description: joi.string().required(),
    author: joi.optional(),
});
