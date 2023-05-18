import { Request, Response } from 'express';
import { AccountService } from './acount.service';

export class AccountController {
    private readonly accountService: AccountService;

    constructor() {
        this.accountService = new AccountService();
    }

    async createUser(req: Request, res: Response) {
        const user = await this.accountService.createUser(req.body);

        return res.status(201).json(user);
    }

    async getUser(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.accountService.getUser({ id: +req.params.id }));
    }

    async getAll(req: Request, res: Response) {
        const accounts = await this.accountService.getAll(req.query);

        return res.status(200).json(accounts);
    }

    async update(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.accountService.update(+req.params.id, req.body));
    }

    async delete(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.accountService.delete(+req.params.id));
    }
}
