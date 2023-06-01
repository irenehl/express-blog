import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { AuthRepository } from './auth.repository';
import { HttpError } from '../common/http-error';
import { AccountService } from '../account/acount.service';
import { MailService } from '../mail/mail.service';

import recoveryHtml from '../templates/recovery.html';
import { loginSchema } from './auth.validator';
import validateSchema from '../common/validate';
import { PrismaClient } from '@prisma/client';

export class AuthService {
    private readonly authRepository: AuthRepository;
    private readonly accountService: AccountService;
    private readonly mailService: MailService;

    constructor(prismaClient: PrismaClient) {
        this.authRepository = new AuthRepository(prismaClient);
        this.accountService = new AccountService(prismaClient);
        this.mailService = new MailService();
    }

    async login(data: LoginDto): Promise<any> {
        validateSchema(data, loginSchema);

        const account = await this.authRepository.authorize(
            { email: data.email },
            data.password
        );

        if (!account) throw new HttpError(401, 'Unauthorized');

        return { token: jwt.sign(account, process.env.JWT_SECRET!) };
    }

    // TODO
    // async verifyEmail(email: string) {
    //     const account = await this.accountService.getAccount({
    //         email,
    //     });

    //     if (!account)
    //         throw new HttpError(404, 'Email not found in any account');

    //     const verifyToken = crypto.randomUUID();

    //     ``;
    // }

    async recoveryRequest(email: string) {
        const account = await this.accountService.getAccount({
            email,
        });

        if (!account)
            throw new HttpError(404, 'Email not found in any account');

        const recoveryToken = crypto.randomUUID();

        await this.accountService.update(account.id, {
            recoveryToken,
        });

        // await this.mailService.sendEmail({
        //     htmlTemplate: recoveryHtml,
        //     subject: 'Reset your password',
        //     toAddresses: [account.email],
        //     textReplacer: (html) =>
        //         html.replaceAll(
        //             'RECOVERY',
        //             `${process.env.HOST}/api/auth/recover/reset/${recoveryToken}`
        //         ),
        // });
    }

    async resetPassword(password: string, recoveryToken: string) {
        if (password === '' || !password)
            throw new HttpError(400, 'Password is invalid');

        const account = await this.authRepository.validateRecovery(
            recoveryToken
        );

        if (!account) throw new HttpError(401, 'This token is invalid');

        const updatedaccount = await this.accountService.update(account.id, {
            password,
        });

        return updatedaccount;
    }
}
