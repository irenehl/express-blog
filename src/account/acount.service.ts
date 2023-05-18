import { Prisma } from '@prisma/client';
import { AccountRepository } from './account.repository';
import { HttpError } from '../common/http-error';
import { AccountDto } from './dtos/account.dto';
import { GetAccountDto } from './dtos/get-account.dto';
import { IPagionation } from '../common/pagination-interface';
import { UpdateAccountDto } from './dtos/update-account.dto';

export class AccountService {
    private readonly accountRepository: AccountRepository;

    constructor() {
        this.accountRepository = new AccountRepository();
    }

    async createUser(data: Prisma.AccountCreateInput): Promise<AccountDto> {
        const account = await this.accountRepository.createAccount(data);

        if (!account) throw new HttpError(409, 'User already exists');

        return account;
    }

    async getUser(query: GetAccountDto): Promise<AccountDto> {
        const user = await this.accountRepository.account(query);

        if (!user) throw new HttpError(404, 'Account not found');

        return user;
    }

    async getAll(data: IPagionation): Promise<AccountDto[]> {
        return await this.accountRepository.getAll(data);
    }

    async update(id: number, data: UpdateAccountDto): Promise<AccountDto> {
        const account = await this.accountRepository.update(id, data);

        if (!account) throw new HttpError(400, 'Something went wrong');

        return account;
    }

    async delete(id: number): Promise<AccountDto> {
        return await this.accountRepository.delete(id);
    }
}
