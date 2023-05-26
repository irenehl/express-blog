import { Account, Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { CreateAccountDto } from './dtos/create-account.dto';
import { BaseRepository } from '../common/base-repository';
import { AccountDto } from './dtos/account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { Pagination } from '../common/interfaces/pagination';

export class AccountRepository extends BaseRepository<Account> {
    private readonly prismaClient: PrismaClient;

    constructor() {
        super();
        this.prismaClient = new PrismaClient();
    }

    async createAccount(dto: CreateAccountDto): Promise<AccountDto | null> {
        const alreadyExists = await this.prismaClient.account.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (alreadyExists) return null;

        const hashedPassword = await bcrypt.hash(
            dto.password,
            +(process.env.SALT ?? 10)
        );

        return this.exclude(
            await this.prismaClient.account.create({
                data: {
                    ...dto,
                    password: hashedPassword,
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
            skip: Number(page - 1),
            take: Number(limit),
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
            },
        });
    }

    async update(
        id: number,
        data: UpdateAccountDto
    ): Promise<AccountDto | null> {
        const hashedPassword = data.password
            ? await bcrypt.hash(data.password, +process.env.SALT! ?? 10)
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

        return this.exclude(account, ['password']);
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
