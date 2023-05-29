import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { AuthRepository } from './auth.repository';
import { HttpError } from '../common/http-error';
import { AccountService } from '../account/acount.service';
import { MailService } from '../mail/mail.service';

import recoveryHtml from '../templates/recovery.html';

export class AuthService {
    private readonly authRepository: AuthRepository;
    private readonly accountService: AccountService;
    private readonly mailService: MailService;

    constructor() {
        this.authRepository = new AuthRepository();
        this.accountService = new AccountService();
        this.mailService = new MailService();
    }

    async login(data: LoginDto): Promise<any> {
        const user = await this.authRepository.authorize(
            { email: data.email },
            data.password
        );

        if (!user) throw new HttpError(401, 'Unauthorized');

        return { token: jwt.sign(user, process.env.JWT_SECRET!) };
    }

    async recoveryRequest(email: string) {
        const user = await this.accountService.getUser({
            email,
        });

        if (!user) throw new HttpError(404, 'Email not found in any account');

        const recoveryToken = crypto.randomUUID();

        await this.accountService.update(user.id, {
            recoveryToken,
        });

        await this.mailService.sendEmail({
            htmlTemplate: recoveryHtml,
            subject: 'Reset your password',
            toAddresses: [user.email],
            textReplacer: (html) =>
                html.replaceAll(
                    'RECOVERY',
                    `${process.env.HOST}/api/auth/recover/reset/${recoveryToken}`
                ),
        });
    }

    async resetPassword(password: string, recoveryToken: string) {
        if (password === '' || !password)
            throw new HttpError(400, 'Password is invalid');

        const user = await this.authRepository.validateRecovery(recoveryToken);

        if (!user) throw new HttpError(401, 'This token is invalid');

        const updatedUser = await this.accountService.update(user.id, {
            password,
        });

        return updatedUser;
    }
}
