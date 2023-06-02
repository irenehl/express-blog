import joi from 'joi';

export const postSchema = joi.object({
    content: joi.string().required(),
    status: joi.string().optional(),
});

export const reportPostSchema = joi.object({
    description: joi.string().required(),
});
