import { Post, Prisma, PrismaClient } from '@prisma/client';
import { IPagionation } from '../common/pagination-interface';

export class PostRepository {
    private readonly prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async create(data: Prisma.PostCreateInput): Promise<Post> {
        return await this.prismaClient.post.create({
            data: {
                ...data,
            },
        });
    }

    async getPost(data: Prisma.PostWhereUniqueInput): Promise<Post | null> {
        return await this.prismaClient.post.findUnique({
            where: {
                ...data,
            },
        });
    }

    async getAll(
        params: IPagionation & {
            cursor?: Prisma.PostWhereUniqueInput;
            where?: Prisma.PostWhereInput;
            orderBy?: Prisma.PostOrderByWithAggregationInput;
        }
    ): Promise<Post[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return await this.prismaClient.post.findMany({
            skip: +page!,
            take: +limit!,
            cursor,
            where,
            orderBy,
        });
    }

    async update(
        authorId: number,
        postId: number,
        data: Prisma.PostUpdateInput
    ): Promise<Post> {
        return await this.prismaClient.post.update({
            where: {
                id: postId,
            },
            data: {
                ...data,
            },
        });
    }

    async delete(postId: number): Promise<Post> {
        return await this.prismaClient.post.delete({
            where: {
                id: postId,
            },
        });
    }

    async belongsTo(authorId: number, postId: number) {
        const post = await this.prismaClient.post.findFirst({
            where: {
                author: {
                    id: authorId,
                },
                id: postId,
            },
        });

        return post?.authorId == authorId;
    }
}
