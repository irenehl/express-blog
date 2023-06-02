import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';

export const modAccountFactoryMock = () => ({
    id: 1,
    email: 'danielalopez+mod@ravn.co',
    name: 'Daniela',
    lastname: 'Huezo',
    username: 'daniela1',
    role: 'MODERATOR' as Role,
    password: bcrypt.hashSync('pass123', 10),
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01'),
    isPublicEmail: false,
    isPublicName: false,
    recoveryToken: null,
    verifyEmailToken: null,
});

export const userAccountMock = {
    ...modAccountFactoryMock(),
    id: 2,
    role: 'USER' as Role,
    username: 'daniela2',
    email: 'danielalopez+user@ravn.co',
    recoveryToken: '123',
    verifyEmailToken: '456',
};

export const updatedAccountMock = {
    id: 1,
    email: 'danielalopez@ravn.co',
    name: 'Daniela',
    lastname: 'Huezo',
    username: 'daniela1',
    role: 'MODERATOR',
    isPublicEmail: false,
    isPublicName: false,
    recoveryToken: null,
};

export const allAccountsMock = [
    {
        id: 1,
        email: 'danielalopez@ravn.co',
        name: 'Daniela',
        lastname: 'Huezo',
        username: 'daniela1',
        role: 'MODERATOR' as Role,
        password: 'pass123',
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-01-01'),
        isPublicEmail: false,
        isPublicName: false,
        recoveryToken: null,
        verifyEmailToken: null,
    },
    {
        id: 2,
        email: 'danielalopez+1@ravn.co',
        name: 'Daniela',
        lastname: 'Huezo',
        username: 'daniela1',
        role: 'USER' as Role,
        password: 'pass123',
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-01-01'),
        isPublicEmail: false,
        isPublicName: false,
        recoveryToken: null,
        verifyEmailToken: null,
    },
    {
        id: 3,
        email: 'danielalopez+1@ravn.co',
        name: 'Daniela',
        lastname: 'Huezo',
        username: 'daniela1',
        role: 'USER' as Role,
        password: 'pass123',
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-01-01'),
        isPublicEmail: false,
        isPublicName: false,
        recoveryToken: null,
        verifyEmailToken: null,
    },
];
