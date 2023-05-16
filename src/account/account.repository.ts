import { Account, Prisma, PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { CreateAccountDto } from './dtos/create-account.dto'
import { BaseRepository } from '../common/base-repository'
import { AccountDto } from './dtos/account.dto'

export class AccountRepository extends BaseRepository<Account> {
    private readonly prismaClient: PrismaClient

    constructor() {
        super()
        this.prismaClient = new PrismaClient()
    }

    async createAccount(dto: CreateAccountDto): Promise<AccountDto | null> {
        const alreadyExists = await this.prismaClient.account.findUnique({
            where: {
                email: dto.email,
            },
        })

        if (alreadyExists) return null

        const hashedPassword = await bcrypt.hash(
            dto.password,
            +(process.env.SALT ?? 10)
        )

        return this.exclude(
            await this.prismaClient.account.create({
                data: {
                    ...dto,
                    password: hashedPassword,
                },
            }),
            ['password']
        )
    }

    async account(
        query: Prisma.AccountWhereUniqueInput
    ): Promise<AccountDto | null> {
        const account = await this.prismaClient.account.findUnique({
            where: {
                ...query,
            },
            rejectOnNotFound: false,
        })

        return account
    }

    async getAll(): Promise<AccountDto[]> {
        const accounts = await this.prismaClient.account.findMany({
            orderBy: {
                created_at: 'desc',
            },
        })

        return accounts
    }
}
