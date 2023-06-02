import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { AuthRepository } from './auth.repository';
import { HttpError } from '../common/http-error';
import { AccountService } from '../account/acount.service';
import { MailService } from '../mail/mail.service';

import recoveryHtml from '../templates/recovery.html';
import {
    emailSchema,
    loginSchema,
    resetPasswordSchema,
} from './auth.validator';
import validateSchema from '../common/validate';
import { PrismaClient } from '@prisma/client';
import { SESClient } from '@aws-sdk/client-ses';

export class AuthService {
    private readonly authRepository: AuthRepository;
    private readonly accountService: AccountService;
    private readonly mailService: MailService;

    constructor(aws: SESClient, prismaClient: PrismaClient) {
        this.authRepository = new AuthRepository(prismaClient);
        this.accountService = new AccountService(aws, prismaClient);
        this.mailService = new MailService(aws);
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

    async verifyEmail(email: string, token: string) {
        validateSchema(email, emailSchema);

        let account = await this.accountService.getAccount({
            email,
        });

        if (!account || account.verifyEmailToken !== token)
            throw new HttpError(
                401,
                'Token is invalid, email cannot be verified'
            );

        account = await this.accountService.update(account.id, {
            verifyEmailToken: null,
        });

        return account;
    }

    async recoveryRequest(email: string) {
        validateSchema(email, emailSchema);

        const account = await this.accountService.getAccount({
            email,
        });

        const recoveryToken = crypto.randomUUID();

        await this.accountService.update(account!.id, {
            recoveryToken,
        });

        await this.mailService.sendEmail({
            htmlTemplate: recoveryHtml,
            subject: 'Reset your password',
            toAddresses: [account!.email],
            textReplacer: (html) =>
                html.replaceAll(
                    'RECOVERY',
                    `${process.env.HOST}/api/auth/recover/reset/${recoveryToken}`
                ),
        });
    }

    async resetPassword(password: string, recoveryToken: string) {
        validateSchema(password, resetPasswordSchema);

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
