import { Request, Response } from 'express';
import { AccountService } from './acount.service';
import prisma from '../config/prisma.client';
import aws from '../config/aws';

export class AccountController {
    private readonly accountService: AccountService;

    constructor() {
        this.accountService = new AccountService(aws, prisma);
    }

    async createAccount(req: Request, res: Response) {
        const account = await this.accountService.createAccount(req.body);

        return res.status(201).json(account);
    }

    async getAccount(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.accountService.getAccount({ id: +req.params.id }));
    }

    async getAll(req: Request, res: Response) {
        const accounts = await this.accountService.getAll({
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 10),
        });

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
