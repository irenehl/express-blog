import { Prisma, PrismaClient, Reactions } from '@prisma/client';
import { AccountService } from '../account/acount.service';
import { Pagination } from '../common/interfaces/pagination';
import { PostService } from '../post/post.service';
import { CommentRepository } from './comment.repository';
import { CommentDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { HttpError } from '../common/http-error';
import { ReportDto } from '../common/dtos/report.dto';
import { MailService } from '../mail/mail.service';
import commentReportHtml from '../templates/comment-report.html';

export class CommentService {
    private readonly commentRepository: CommentRepository;
    private readonly accountService: AccountService;
    private readonly postService: PostService;
    private readonly mailService: MailService;

    constructor(prismaClient: PrismaClient) {
        this.commentRepository = new CommentRepository(prismaClient);
        this.accountService = new AccountService(prismaClient);
        this.postService = new PostService(prismaClient);
        this.mailService = new MailService();
    }

    async createComment(
        accountId: number,
        postId: number,
        data: CreateCommentDto
    ): Promise<CommentDto> {
        const account = await this.accountService.getAccount({ id: accountId });
        const post = await this.postService.getPost({ id: postId });

        return this.commentRepository.create({
            author: {
                connect: {
                    id: account?.id,
                },
            },
            post: {
                connect: {
                    id: post?.id,
                },
            },
            ...data,
        });
    }

    async getAllComments(
        postId: number,
        data: Pagination
    ): Promise<CommentDto[] | null> {
        const post = await this.postService.getPost({ id: postId });

        if (!post) throw new HttpError(404, 'Post not found');

        return await this.commentRepository.getAll({
            ...data,
        });
    }

    async updateComment(
        authorId: number,
        commentId: number,
        data: Prisma.CommentUpdateInput
    ): Promise<CommentDto | null> {
        const isAuthor = await this.commentRepository.belongsTo(
            authorId,
            commentId
        );

        if (!isAuthor)
            throw new HttpError(403, 'Comment does not belong to account');

        const updatedComment = await this.commentRepository.updateComment(
            commentId,
            data
        );

        if (!updatedComment) throw new HttpError(400, 'Something went wrong');

        return updatedComment;
    }

    async reactionOnComment(
        authorId: number,
        commentId: number,
        reaction: Reactions
    ) {
        const comment = await this.commentRepository.getOne({ id: commentId });

        if (!comment) throw new HttpError(404, 'Comment not found');

        return await this.commentRepository.reactionOnComment(
            commentId,
            authorId,
            reaction
        );
    }

    async getReactions(commendId: number) {
        return this.commentRepository.getReactions(commendId);
    }

    async reportComment(
        authorId: number,
        commentId: number,
        data: Prisma.ReportCreateInput
    ): Promise<ReportDto> {
        const comment = await this.commentRepository.getOne({ id: commentId });

        if (!comment) throw new HttpError(404, 'Comment not found');

        const reportCreated = await this.commentRepository.createReport(
            authorId,
            commentId,
            data
        );

        // await this.mailService.sendEmail({
        //     htmlTemplate: commentReportHtml,
        //     subject: 'Comment reported',
        //     toAddresses: await this.accountService.getAccountEmail(),
        //     textReplacer: (htmlData) =>
        //         htmlData.replaceAll(
        //             'COMMENT',
        //             `${process.env.HOST}/api/posts/${comment.postId}/comments/${commentId}`
        //         ),
        // });

        return reportCreated;
    }

    async getReports(accountId: number, commendId: number) {
        const comment = await this.commentRepository.getOne({ id: commendId });

        if (!comment) throw new HttpError(404, 'Comment not found');

        const account = await this.accountService.getAccount({
            id: accountId,
        });

        if (account?.role !== 'MODERATOR')
            throw new HttpError(403, 'Forbidden');

        return this.commentRepository.getReports(commendId);
    }

    async deleteComment(
        commentId: number,
        accountId: number
    ): Promise<CommentDto> {
        let canDelete = true;

        const isAuthor = await this.commentRepository.belongsTo(
            accountId,
            commentId
        );

        if (!isAuthor) {
            const account = await this.accountService.getAccount({
                id: accountId,
            });

            if (account?.role !== 'MODERATOR') canDelete = false;
        }

        if (!canDelete) throw new HttpError(403, 'Forbidden');

        return await this.commentRepository.delete(commentId);
    }

    async deleteAllComments(postId: number) {
        return await this.commentRepository.deleteAllComments(postId);
    }
}
