import bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { modAccountFactoryMock } from '../tests/mocks/account.mock';
import { prismaMock } from '../tests/mocks/prisma.mock';

describe('PostService', () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService(prismaMock);
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

            const bcryptCompare = jest.fn().mockResolvedValue(false);
            (bcrypt.compare as jest.Mock) = bcryptCompare;

            await expect(
                authService.login({
                    email: 'danielalopez@ravn.co',
                    password: 'pass123',
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
    });
});
