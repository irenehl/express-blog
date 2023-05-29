import { Account } from '@prisma/client';

export type AccountDto = Omit<Account, 'password' | 'recoveryToken'>;
