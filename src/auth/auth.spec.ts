import bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import {
    modAccountFactoryMock,
    userAccountMock,
} from '../tests/mocks/account.mock';
import { prismaMock } from '../tests/mocks/prisma.mock';
import aws from '../config/aws';

let authService: AuthService;

jest.mock('../config/aws', () => {
    const ses = {
        send: jest.fn(),
    };

    return ses;
});

describe('AuthService', () => {
    beforeEach(() => {
        authService = new AuthService(aws, prismaMock);
    });

    describe('/auth/login', () => {
        it('Should return a token when account is valid', async () => {
            prismaMock.account.findUnique.mockResolvedValue(
                modAccountFactoryMock()
            );

            await expect(
                authService.login({
                    email: 'danielalopez@ravn.co',
                    password: 'pass123',
                })
            ).resolves.toHaveProperty('token');
        });

        it('Should fail with 401 when password is invalid', async () => {
            prismaMock.account.findUnique.mockResolvedValue(
                modAccountFactoryMock()
            );

            await expect(
                authService.login({
                    email: 'danielalopez@ravn.co',
                    password: 'loremipsum',
                })
            ).rejects.toThrowError('Unauthorized');
        });

        it('Should fail with 404 when account not found', async () => {
            prismaMock.account.findUnique.mockResolvedValue(
                modAccountFactoryMock()
            );

            const bcryptCompare = jest.fn().mockResolvedValue(false);
            (bcrypt.compare as jest.Mock) = bcryptCompare;

            await expect(
                authService.login({
                    email: 'john@gmail.com',
                    password: 'pass123',
                })
            ).rejects.toThrowError('Unauthorized');
        });

        it('Should return false when account is not found', async () => {
            prismaMock.account.findUnique.mockResolvedValue(null);

            jest.fn().mockResolvedValue(false);

            await expect(
                authService.login({
                    email: 'john@gmail.com',
                    password: 'pass123',
                })
            ).rejects.toThrowError('Unauthorized');
        });
    });

    describe('/auth/recover/request', () => {
        it('Should send verification token', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.account.update.mockResolvedValue({
                ...userAccountMock,
                recoveryToken: 'e66c1414 -ef82-43ba-b008-ca4cc3331f8c',
            });

            await authService.recoveryRequest(userAccountMock.email);

            expect(aws.send).toHaveBeenCalled();
        });

        it('Should fail when send verification token', async () => {
            prismaMock.account.findUnique.mockResolvedValue(null);
            prismaMock.account.update.mockResolvedValue({
                ...userAccountMock,
                recoveryToken: 'e66c1414-ef82-43ba-b008-ca4cc3331f8c',
            });

            await expect(
                authService.recoveryRequest('loremipsum@gmail.com')
            ).rejects.toThrow('Account not found');
        });
    });

    describe('/auth/recover/reset/:token', () => {
        it('Should reset the password', async () => {
            prismaMock.account.findFirst.mockResolvedValue(userAccountMock);
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.account.update.mockResolvedValue({
                ...userAccountMock,
                password: await bcrypt.hash('newpass12', 10),
            });

            await authService.resetPassword('newpass12', '123');

            expect(prismaMock.account.findFirst).toHaveBeenCalled();
            expect(prismaMock.account.update).toHaveBeenCalled();
        });

        it('Should fail when reset the password if the password is empty', async () => {
            await expect(
                authService.resetPassword(
                    null as unknown as string,
                    null as unknown as string
                )
            ).rejects.toThrow('Password is invalid');
        });

        it('Should fail when token is invalid (not found)', async () => {
            prismaMock.account.findFirst.mockResolvedValue(null);

            await expect(authService.resetPassword('a', 'b')).rejects.toThrow(
                'This token is invalid'
            );
        });
    });

    describe('/auth/verify/:token', () => {
        it('Should verify email', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.account.update.mockResolvedValue({
                ...userAccountMock,
                verifyEmailToken: '456',
            });

            const result = await authService.verifyEmail(
                'loremipsum@gmail.com',
                '456'
            );

            expect(result.verifyEmailToken).toEqual('456');
        });

        it('Should fail when verify email for account not found', async () => {
            prismaMock.account.findUnique.mockResolvedValue(null);
            prismaMock.account.update.mockResolvedValue({
                ...userAccountMock,
                verifyEmailToken: '456',
            });

            await expect(
                authService.verifyEmail('loremipsum@gmail.com', '456')
            ).rejects.toThrow('Account not found');
        });

        it('Should fail when verify email for invalid token', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.account.update.mockResolvedValue({
                ...userAccountMock,
                verifyEmailToken: '456',
            });

            await expect(
                authService.verifyEmail('loremipsum@gmail.com', '123')
            ).rejects.toThrow('Token is invalid, email cannot be verified');
        });
    });
});
