import { Post, Prisma, PrismaClient, Reactions } from '@prisma/client';
import { Pagination } from '../common/interfaces/pagination';
import { getReactionsEnum } from '../common/get-reactions';
import { ReportDto } from '../common/dtos/report.dto';

export class PostRepository {
    private readonly prismaClient: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient;
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
        params: Pagination & {
            cursor?: Prisma.PostWhereUniqueInput;
            where?: Prisma.PostWhereInput;
            orderBy?: Prisma.PostOrderByWithAggregationInput;
        }
    ): Promise<Post[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return await this.prismaClient.post.findMany({
            skip: page - 1,
            take: limit,
            cursor,
            where,
            orderBy,
        });
    }

    async update(postId: number, data: Prisma.PostUpdateInput): Promise<Post> {
        return await this.prismaClient.post.update({
            where: {
                id: postId,
            },
            data: {
                ...data,
            },
        });
    }

    async reactionOnPost(
        postId: number,
        authorId: number,
        reaction: Reactions | 'NULL'
    ) {
        if (reaction === 'NULL') {
            const hasReacted =
                await this.prismaClient.reactionsOnPosts.findUnique({
                    where: {
                        postId_authorId: {
                            postId,
                            authorId,
                        },
                    },
                });

            return hasReacted
                ? this.prismaClient.reactionsOnPosts.delete({
                      where: {
                          postId_authorId: {
                              postId,
                              authorId,
                          },
                      },
                  })
                : null;
        }

        return await this.prismaClient.reactionsOnPosts.upsert({
            where: {
                postId_authorId: {
                    postId,
                    authorId,
                },
            },
            create: {
                authorId,
                postId,
                reaction: getReactionsEnum(reaction),
            },
            update: {
                reaction: getReactionsEnum(reaction),
            },
        });
    }

    async getReactions(postId: number) {
        return this.prismaClient.reactionsOnPosts.findMany({
            where: {
                postId,
            },
        });
    }

    async createReport(
        authorId: number,
        postId: number,
        data: Prisma.ReportCreateInput
    ): Promise<ReportDto> {
        return await this.prismaClient.report.create({
            data: {
                description: data.description,
                author: {
                    connect: {
                        id: authorId,
                    },
                },
                post: {
                    connect: {
                        id: postId,
                    },
                },
            },
        });
    }

    async getReports(postId: number): Promise<ReportDto[]> {
        return await this.prismaClient.report.findMany({
            where: {
                postId,
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
