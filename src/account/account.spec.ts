import aws from '../config/aws';
import { allAccountsMock, userAccountMock } from '../tests/mocks/account.mock';
import { prismaMock } from '../tests/mocks/prisma.mock';
import { AccountService } from './acount.service';

let accountService: AccountService;

jest.mock('../config/aws', () => {
    const ses = {
        send: jest.fn(),
    };

    return ses;
});

describe('AccountService', () => {
    beforeEach(() => {
        accountService = new AccountService(aws, prismaMock);
    });

    describe('/accounts', () => {
        it('Should create a new account', async () => {
            prismaMock.account.create.mockResolvedValue(userAccountMock);

            const result = await accountService.createAccount({
                name: 'Daniela',
                lastname: 'Huezo',
                email: 'danielalopez+user@ravn.co',
                username: 'daniela2',
                password: 'password123',
            });

            expect(aws.send).toHaveBeenCalled();
            expect(result).toEqual(userAccountMock);
        });

        it('Should fail creating a new account when account already exists', async () => {
            prismaMock.account.findFirst.mockResolvedValue(userAccountMock);

            await expect(
                accountService.createAccount({
                    name: 'Daniela',
                    lastname: 'Huezo',
                    email: 'danielalopez+user@ravn.co',
                    username: 'daniela2',
                    password: 'password123',
                })
            ).rejects.toThrow('Account already exists');
        });

        it('Should return all accounts paginated', async () => {
            prismaMock.account.findMany.mockResolvedValueOnce(allAccountsMock);

            const pagination = { page: 0, limit: 15 };
            const result = await accountService.getAll(pagination);

            expect(result).toHaveLength(3);
            expect(result).toEqual(allAccountsMock);
        });
    });

    describe('/accounts/:id', () => {
        it('Should return an specific account', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);

            expect(await accountService.getAccount({ id: 1 })).toEqual(
                userAccountMock
            );
        });

        it('Should patch an account that belongs to the logged user', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.account.update.mockResolvedValue({
                ...userAccountMock,
                name: 'Irene',
                isPublicEmail: true,
            });

            const info = {
                name: 'Irene',
                isPublicEmail: true,
            };

            const result = await accountService.update(1, info);

            expect(result).toHaveProperty('name');
            expect(result.name).toEqual('Irene');
            expect(result.isPublicEmail).toEqual(true);
        });

        it('Should encrypt password when patch passport filed in account', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.account.update.mockResolvedValue({
                ...userAccountMock,
                name: 'Irene',
                password: 'newpass',
                isPublicEmail: true,
            });

            const info = {
                name: 'Irene',
                password: 'newpass',
                isPublicEmail: true,
            };

            const result = await accountService.update(1, info);

            expect(result).toHaveProperty('name');
            expect(result.name).toEqual('Irene');
            expect(result.isPublicEmail).toEqual(true);
        });

        it('Should fail when patch an account', async () => {
            prismaMock.account.findUnique.mockResolvedValue(null);
            prismaMock.account.update.mockResolvedValue({
                ...userAccountMock,
                name: 'Irene',
                isPublicEmail: true,
            });

            const info = {
                name: 'Irene',
                isPublicEmail: true,
            };

            await expect(accountService.update(1, info)).rejects.toThrow(
                'Something went wrong'
            );
        });

        it('Should delete a specific account', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.account.delete.mockResolvedValue(userAccountMock);

            const result = await accountService.delete(userAccountMock.id);

            expect(result).toMatchObject(userAccountMock);
        });

        it('Should fail when an account is not found', async () => {
            prismaMock.account.findUnique.mockResolvedValue(null);

            await expect(
                accountService.getAccount({ id: 1000 })
            ).rejects.toThrow('Account not found');
        });
    });

    describe('getAccountEmail', () => {
        it('Should return accounts based on role', async () => {
            prismaMock.account.findMany.mockResolvedValue(allAccountsMock);

            const result = await accountService.getAccountEmail();

            expect(result).toEqual(
                allAccountsMock.map((account) => account.email)
            );
        });
    });
});
