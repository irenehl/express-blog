import joi from 'joi';

export const commentSchema = joi.object({
    content: joi.string().required(),
    status: joi.string().optional(),
});

export const reportCommentSchema = joi.object({
    description: joi.string().required(),
});
