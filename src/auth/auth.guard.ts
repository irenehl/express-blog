import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../common/http-error';

export default function modGuard(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.user?.role !== 'MODERATOR') {
        throw new HttpError(403, 'Forbidden');
    }

    next();
}
