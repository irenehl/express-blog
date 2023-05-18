import { Account, Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { CreateAccountDto } from './dtos/create-account.dto';
import { BaseRepository } from '../common/base-repository';
import { AccountDto } from './dtos/account.dto';
import { IPagionation } from '../common/pagination-interface';
import { UpdateAccountDto } from './dtos/update-account.dto';

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

    async account(
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
                role: true,
                createdAt: true,
                updatedAt: true,
                isPublicEmail: true,
                isPublicName: true,
            },
        });
    }

    async getAll(
        params: IPagionation & {
            cursor?: Prisma.AccountWhereUniqueInput;
            where?: Prisma.AccountWhereInput;
            orderBy?: Prisma.AccountOrderByWithAggregationInput;
        }
    ): Promise<AccountDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return await this.prismaClient.account.findMany({
            skip: +page!,
            take: +limit!,
            cursor,
            where,
            orderBy,
            select: {
                id: true,
                name: true,
                lastname: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                isPublicEmail: true,
                isPublicName: true,
            },
        });
    }

    async update(id: number, data: UpdateAccountDto): Promise<AccountDto> {
        let hashedPassword;

        data.password
            ? (hashedPassword = await bcrypt.hash(
                  data.password,
                  +process.env.SALT! ?? 10
              ))
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
        return this.prismaClient.account.delete({
            where: {
                id,
            },
        });
    }
}
