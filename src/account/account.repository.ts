import { v4 as uuid } from 'uuid';
import { Account, Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { CreateAccountDto } from './dtos/create-account.dto';
import { BaseRepository } from '../common/base-repository';
import { AccountDto } from './dtos/account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { Pagination } from '../common/interfaces/pagination';

export class AccountRepository extends BaseRepository<Account> {
    private readonly prismaClient: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        super();
        this.prismaClient = prismaClient;
    }

    async createAccount(dto: CreateAccountDto): Promise<AccountDto | null> {
        const alreadyExists = await this.prismaClient.account.findFirst({
            where: {
                email: dto.email,
                username: dto.username,
            },
        });

        if (alreadyExists) return null;

        const hashedPassword = await bcrypt.hash(
            dto.password,
            Number(process.env.SALT!)
        );

        return this.exclude(
            await this.prismaClient.account.create({
                data: {
                    ...dto,
                    password: hashedPassword,
                    verifyEmailToken: uuid(),
                },
            }),
            ['password']
        );
    }

    async getOne(
        query: Prisma.AccountWhereUniqueInput
    ): Promise<AccountDto | null> {
        return await this.prismaClient.account.findUnique({
            where: {
                ...query,
            },
            select: {
                id: true,
                name: true,
                lastname: true,
                email: true,
                username: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                isPublicEmail: true,
                isPublicName: true,
                verifyEmailToken: true,
            },
        });
    }

    async getAll(
        params: Pagination & {
            cursor?: Prisma.AccountWhereUniqueInput;
            where?: Prisma.AccountWhereInput;
            orderBy?: Prisma.AccountOrderByWithAggregationInput;
        }
    ): Promise<AccountDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return await this.prismaClient.account.findMany({
            skip: page - 1,
            take: limit,
            cursor,
            where,
            orderBy,
            select: {
                id: true,
                name: true,
                lastname: true,
                email: true,
                role: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                isPublicEmail: true,
                isPublicName: true,
                verifyEmailToken: true,
            },
        });
    }

    async getAccountEmail(): Promise<AccountDto[]> {
        return await this.prismaClient.account.findMany({
            where: {
                role: 'MODERATOR',
            },
        });
    }

    async update(
        id: number,
        data: UpdateAccountDto
    ): Promise<AccountDto | null> {
        const alreadyExists = await this.prismaClient.account.findUnique({
            where: {
                id,
            },
        });

        if (!alreadyExists) return null;

        const hashedPassword = data.password
            ? await bcrypt.hash(data.password, +process.env.SALT!)
            : undefined;

        const account = await this.prismaClient.account.update({
            data: {
                ...data,
                password: hashedPassword,
            },
            where: {
                id,
            },
        });

        return this.exclude(account, ['password', 'updatedAt', 'createdAt']);
    }

    async delete(id: number): Promise<AccountDto> {
        const account = await this.prismaClient.account.delete({
            where: {
                id,
            },
        });

        return this.exclude(account, ['password']);
    }
}
