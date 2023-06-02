import { Prisma } from '@prisma/client';

export interface UpdateAccountDto extends Prisma.AccountUpdateInput {
    name?: string;
    lastname?: string;
    password?: string;
    email?: string;
    verifyToken?: string;
}
