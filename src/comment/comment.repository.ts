import { Prisma, PrismaClient, Reactions } from '@prisma/client';
import { CommentDto } from './dto/comment.dto';
import { Pagination } from '../common/interfaces/pagination';
import { getReactionsEnum } from '../common/get-reactions';
import { ReportDto } from '../common/dtos/report.dto';

export class CommentRepository {
    private readonly prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async create(data: Prisma.CommentCreateInput): Promise<CommentDto> {
        return await this.prismaClient.comment.create({
            data: {
                ...data,
            },
        });
    }

    async getOne(
        data: Prisma.CommentWhereUniqueInput
    ): Promise<CommentDto | null> {
        return await this.prismaClient.comment.findUnique({
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
    ): Promise<CommentDto[] | null> {
        const { page, limit, cursor, where, orderBy } = params;

        return await this.prismaClient.comment.findMany({
            skip: Number(page - 1),
            take: Number(limit),
            cursor,
            orderBy,
            where: {
                post: {
                    id: where,
                },
            },
        });
    }

    async updateComment(
        commentId: number,
        data: Prisma.CommentUpdateInput
    ): Promise<CommentDto> {
        return await this.prismaClient.comment.update({
            where: {
                id: commentId,
            },
            data: {
                ...data,
            },
        });
    }

    async reactionOnComment(
        commentId: number,
        authorId: number,
        reaction: Reactions | 'NULL'
    ) {
        if (reaction === 'NULL') {
            const hasReacted =
                await this.prismaClient.reactionsOnComments.findUnique({
                    where: {
                        authorId_commentId: {
                            commentId,
                            authorId,
                        },
                    },
                });

            return hasReacted
                ? this.prismaClient.reactionsOnComments.delete({
                      where: {
                          authorId_commentId: {
                              commentId,
                              authorId,
                          },
                      },
                  })
                : null;
        }

        return this.prismaClient.reactionsOnComments.upsert({
            where: {
                authorId_commentId: {
                    authorId,
                    commentId,
                },
            },
            create: {
                authorId,
                commentId,
                reaction: getReactionsEnum(reaction),
            },
            update: {
                reaction: getReactionsEnum(reaction),
            },
        });
    }

    async getReactions(commentId: number) {
        return this.prismaClient.reactionsOnComments.findMany({
            where: {
                commentId,
            },
        });
    }

    async createReport(
        authorId: number,
        commentId: number,
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
                comment: {
                    connect: {
                        id: commentId,
                    },
                },
            },
        });
    }

    async delete(commentId: number): Promise<CommentDto> {
        return this.prismaClient.comment.delete({
            where: {
                id: commentId,
            },
        });
    }

    async deleteAllComments(postId: number) {
        return await this.prismaClient.comment.deleteMany({
            where: {
                postId,
            },
        });
    }

    async belongsTo(authorId: number, commentId: number) {
        const comment = await this.prismaClient.comment.findFirst({
            where: {
                author: {
                    id: authorId,
                },
                id: commentId,
            },
        });

        return comment?.authorId == authorId;
    }
}
