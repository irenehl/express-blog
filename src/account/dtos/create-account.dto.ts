import { Prisma } from '@prisma/client';

export type CreateAccountDto = Omit<
    Prisma.AccountCreateInput,
    'createdAt' | 'updatedAt' | 'role'
>;
