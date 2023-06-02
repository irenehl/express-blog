import { Prisma, PrismaClient } from '@prisma/client';
import { AccountRepository } from './account.repository';
import { HttpError } from '../common/http-error';
import { AccountDto } from './dtos/account.dto';
import { GetAccountDto } from './dtos/get-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { Pagination } from '../common/interfaces/pagination';
import { MailService } from '../mail/mail.service';

import welcomeHtml from '../templates/welcome.html';
import { SESClient } from '@aws-sdk/client-ses';
import validateSchema from '../common/validate';
import { createAccountSchema, updateAccountSchema } from './account.validator';

export class AccountService {
    private readonly accountRepository: AccountRepository;
    private readonly mailService: MailService;

    constructor(aws: SESClient, prismaClient: PrismaClient) {
        this.accountRepository = new AccountRepository(prismaClient);
        this.mailService = new MailService(aws);
    }

    async createAccount(
        data: Prisma.AccountCreateInput
    ): Promise<AccountDto | null> {
        validateSchema(data, createAccountSchema);

        const account = await this.accountRepository.createAccount(data);

        if (!account) throw new HttpError(409, 'Account already exists');

        await this.mailService.sendEmail({
            htmlTemplate: welcomeHtml,
            toAddresses: [account.email],
            subject: 'Thanks for registering',
            textReplacer: (htmlData) =>
                htmlData
                    .replaceAll('USERNAME', account.username)
                    .replaceAll(
                        'EMAIL_VERIFICATION',
                        `${process.env.HOST!}/auth/verify/${
                            account.verifyEmailToken
                        }`
                    ),
        });

        return account;
    }

    async getAccount(query: GetAccountDto): Promise<AccountDto | null> {
        const account = await this.accountRepository.getOne(query);

        if (!account) throw new HttpError(404, 'Account not found');

        return account;
    }

    async getAll(data: Pagination): Promise<AccountDto[]> {
        return await this.accountRepository.getAll(data);
    }

    async getAccountEmail(): Promise<string[]> {
        const accounts = await this.accountRepository.getAccountEmail();

        const emails = accounts.map((account) => account.email);

        return emails;
    }

    async update(id: number, data: UpdateAccountDto): Promise<AccountDto> {
        validateSchema(data, updateAccountSchema);

        const account = await this.accountRepository.update(id, data);

        if (!account) throw new HttpError(400, 'Something went wrong');

        return account;
    }

    async delete(id: number): Promise<AccountDto | null> {
        await this.getAccount({ id });

        return await this.accountRepository.delete(id);
    }
}
