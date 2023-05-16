import bcrypt from 'bcrypt'
import { Account, Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { BaseRepository } from '../common/base-repository'

export class AuthRepository extends BaseRepository<Account> {
    private readonly prismaClient: PrismaClient

    constructor() {
        super()
        this.prismaClient = new PrismaClient()
    }

    async authorize(query: Prisma.AccountWhereUniqueInput, password: string) {
        const account = await this.prismaClient.account.findUnique({
            where: {
                ...query,
            },
        })

        const isValid = account
            ? bcrypt.compare(password, account?.password)
            : false

        if (isValid)
            return this.exclude(account!, [
                'name',
                'email',
                'password',
                'lastname',
                'created_at',
                'updated_at',
            ])

        return null
    }
}
