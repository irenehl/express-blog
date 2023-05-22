import { PayloadDto } from '../auth/dto/payload.dto';

declare global {
    namespace Express {
        export interface Request {
            user?: PayloadDto;
        }
    }
}

export {};
