import { getReactionsEnum } from './get-reactions';
import { HttpError } from './http-error';
import validateSchema from './validate';
import joi from 'joi';

describe('Common', () => {
    describe('get-reactions', () => {
        it('Should return LIKE when reaction is LIKE', () => {
            expect(getReactionsEnum('LIKE')).toBe('LIKE');
        });
        it('Should return DISLIKE when reaction is DISLIKE', () => {
            expect(getReactionsEnum('DISLIKE')).toBe('DISLIKE');
        });
        it('Should return LOVE when reaction is LOVE', () => {
            expect(getReactionsEnum('LOVE')).toBe('LOVE');
        });
        it('Should return ANGRY when reaction is ANGRY', () => {
            expect(getReactionsEnum('ANGRY')).toBe('ANGRY');
        });
        it('Should return FUNNY when reaction is FUNNY', () => {
            expect(getReactionsEnum('FUNNY')).toBe('FUNNY');
        });
        it('Should return LIKE by default', () => {
            expect(getReactionsEnum('')).toBe('LIKE');
        });
    });
    describe('http-error', () => {
        it('should create an instance of HttpError with the correct statusCode and message', () => {
            const statusCode = 404;
            const message = 'Not Found';
            const httpError = new HttpError(statusCode, message);

            expect(httpError).toBeInstanceOf(HttpError);
            expect(httpError.getStatusCode()).toBe(statusCode);
            expect(httpError.message).toBe(message);
        });
    });
    describe('validateSchema', () => {
        it('should throw an HttpError with status code 400 when provided with invalid data', () => {
            const invalidData = { username: 'john', age: 'thirty' };
            const schema = joi.object({
                username: joi.string().required(),
                age: joi.number().integer().required(),
            });

            expect(() => validateSchema(invalidData, schema)).toThrow(
                HttpError
            );
            expect(() => validateSchema(invalidData, schema)).toThrowError(
                new HttpError(400, '"age" must be a number')
            );
        });
    });
});
