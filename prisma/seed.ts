import { PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    for (let i = 0; i < 100; i++) {
        await prisma.account.create({
            data: {
                id: i,
                name: faker.person.firstName(),
                lastname: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                publicEmail: faker.datatype.boolean(),
                createdAt: faker.date.between({ from: '2000-01-01T00:00:00.000Z', to: '2022-01-01T00:00:00.000Z' }),
                role: 'USER'
            }
        })
    }
    for (let i = 0; i < 100; i++) {
        await prisma.post.create({
            data: {
                id: i,
                status: 'PUBLISHED', 
                content: faker.lorem.sentence(),
                accountId: i,
                createdAt: faker.date.between({ from: '2000-01-01T00:00:00.000Z', to: '2022-01-01T00:00:00.000Z' })
            }
        })
    }

    for (let i = 0; i < 100; i++) {
        await prisma.comment.create({
            data: {
                id: i,
                content: faker.lorem.sentence(),
                createdAt: faker.date.between({ from: '2000-01-01T00:00:00.000Z', to: '2022-01-01T00:00:00.000Z' }),
                status: 'PUBLISHED',
                accountId: i,
                postId: i,
            }
        })
    }

    for (let i = 0; i < 50; i++) {
        await prisma.likesOnPosts.create({
            data: {
                id: i,
                authorId: i,
                postId: faker.number.int(50)
            }
        })
    }

    for (let i = 0; i < 50; i++) {
        await prisma.likesOnComments.create({
            data: {
                id: i,
                authorId: i,
                commentId: faker.number.int(99)
            }
        })
    }

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1)
    })
    .finally(async () => {
        prisma.$disconnect
    })
