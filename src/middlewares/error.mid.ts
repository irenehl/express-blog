import { NextFunction, Request, Response } from 'express'
import { HttpError } from '../common/http-error'

export default function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof HttpError)
        return res.status(err.getStatusCode()).json({ message: err.message })

    if (err) return res.status(400).json({ message: 'Something went wrong' })

    next()
}
