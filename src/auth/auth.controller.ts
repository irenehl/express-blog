import { AuthService } from './auth.service';
import { Request, Response } from 'express';

export class AuthController {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login(req: Request, res: Response) {
        return res.status(200).json(await this.authService.login(req.body));
    }
}
