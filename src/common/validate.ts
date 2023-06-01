import joi from 'joi';
import { HttpError } from './http-error';

export default function validateSchema<T>(data: T, schema: joi.ObjectSchema) {
    const { error } = schema.validate(data);

    if (error) throw new HttpError(400, error.message);
}
