import { Prisma } from '@prisma/client';
import { AccountRepository } from './account.repository';
import { HttpError } from '../common/http-error';
import { AccountDto } from './dtos/account.dto';
import { GetAccountDto } from './dtos/get-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { Pagination } from '../common/interfaces/pagination';
import { PostRepository } from '../post/post.repository';

export class AccountService {
    private readonly accountRepository: AccountRepository;
    private readonly postRepository: PostRepository;

    constructor() {
        this.accountRepository = new AccountRepository();
        this.postRepository = new PostRepository();
    }

    async createUser(data: Prisma.AccountCreateInput): Promise<AccountDto> {
        const account = await this.accountRepository.createAccount(data);

        if (!account) throw new HttpError(409, 'User already exists');

        return account;
    }

    async getUser(query: GetAccountDto): Promise<AccountDto | null> {
        const account = await this.accountRepository.getOne(query);

        //if (!account) throw new HttpError(404, 'Account not found');

        return account;
    }

    async getAll(data: Pagination): Promise<AccountDto[]> {
        return await this.accountRepository.getAll(data);
    }

    async update(id: number, data: UpdateAccountDto): Promise<AccountDto> {
        const accountExists = await this.accountRepository.getOne({ id });

        if (!accountExists) throw new HttpError(404, 'Account not found');

        const account = await this.accountRepository.update(id, data);

        if (!account) throw new HttpError(400, 'Something went wrong');

        return account;
    }

    async delete(id: number): Promise<AccountDto> {
        await this.postRepository.deleteAllPostAndComments(id);

        return await this.accountRepository.delete(id);
    }
}
