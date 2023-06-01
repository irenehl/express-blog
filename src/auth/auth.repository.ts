import bcrypt from 'bcrypt';
import { Account, Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../common/base-repository';

export class AuthRepository extends BaseRepository<Account> {
    private readonly prismaClient: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        super();
        this.prismaClient = prismaClient;
    }

    async authorize(query: Prisma.AccountWhereUniqueInput, password: string) {
        const account = await this.prismaClient.account.findUnique({
            where: {
                ...query,
            },
        });

        const isValid = account
            ? await bcrypt.compare(password, account?.password)
            : false;

        return isValid
            ? this.exclude(account!, [
                  'name',
                  'email',
                  'password',
                  'lastname',
                  'createdAt',
                  'updatedAt',
              ])
            : null;
    }

    async validateRecovery(recoveryToken: string) {
        return this.prismaClient.account.findFirst({
            where: { recoveryToken },
        });
    }
}
