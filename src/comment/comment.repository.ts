import { Prisma, PrismaClient } from '@prisma/client';
import { CommentDto } from './dto/comment.dto';
import { Pagination } from '../common/interfaces/pagination';

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
            skip: Number(page),
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
        postId: number,
        commentId: number,
        data: Prisma.CommentUpdateInput
    ) {
        return await this.prismaClient.comment.updateMany({
            where: {
                id: commentId,
                postId,
            },
            data: {
                ...data,
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
