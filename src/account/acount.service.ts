import { Prisma } from '@prisma/client'
import { AccountRepository } from './account.repository'
import { HttpError } from '../common/http-error'
import { AccountDto } from './dtos/account.dto'
import { GetAccountDto } from './dtos/get-account.dto'

const accountRepository = new AccountRepository()

export class AccountService {
    private readonly accountRepository: AccountRepository

    constructor() {
        this.accountRepository = new AccountRepository()
    }

    async createUser(data: Prisma.AccountCreateInput): Promise<AccountDto> {
        const account = await this.accountRepository.createAccount(data)

        if (!account) throw new HttpError(409, 'User already exists')

        return account
    }

    async getUser(query: GetAccountDto) {
        const user = await this.accountRepository.account(query)

        if (!user) throw new HttpError(404, 'Account not found')

        return user
    }

    async getAll(): Promise<AccountDto[]> {
        return accountRepository.getAll()
    }
}
