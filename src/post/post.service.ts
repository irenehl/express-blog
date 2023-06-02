import { Prisma, PrismaClient, Reactions } from '@prisma/client';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { AccountService } from '../account/acount.service';
import { HttpError } from '../common/http-error';
import { PostDto } from './dto/post.dto';
import { Pagination } from '../common/interfaces/pagination';
import { ReportDto } from '../common/dtos/report.dto';
import { MailService } from '../mail/mail.service';
import { CommentRepository } from '../comment/comment.repository';
import { SESClient } from '@aws-sdk/client-ses';
import postReportHtml from '../templates/post-report.html';
import validateSchema from '../common/validate';
import { postSchema, reportPostSchema } from './post.validate';

export class PostService {
    private readonly postRepository: PostRepository;
    private readonly accountService: AccountService;
    private readonly commentRepository: CommentRepository; // To avoid redundancy
    private readonly mailService: MailService;

    constructor(aws: SESClient, prismaClient: PrismaClient) {
        this.postRepository = new PostRepository(prismaClient);
        this.accountService = new AccountService(aws, prismaClient);
        this.commentRepository = new CommentRepository(prismaClient);
        this.mailService = new MailService(aws);
    }

    async createPost(accountId: number, data: CreatePostDto): Promise<PostDto> {
        validateSchema(data, postSchema);

        const account = await this.accountService.getAccount({ id: accountId });

        return this.postRepository.create({
            author: {
                connect: {
                    id: account?.id,
                },
            },
            ...data,
        });
    }

    async getPost(data: Prisma.PostWhereUniqueInput): Promise<PostDto | null> {
        const post = await this.postRepository.getPost(data);

        if (!post) throw new HttpError(404, 'Post not found');

        return post;
    }

    async getAll(data: Pagination): Promise<PostDto[]> {
        return await this.postRepository.getAll(data);
    }

    async updatePost(
        authorId: number,
        id: number,
        data: Prisma.PostUpdateInput
    ): Promise<PostDto> {
        validateSchema(data, postSchema);

        const isAuthor = await this.postRepository.belongsTo(authorId, id);

        if (!isAuthor)
            throw new HttpError(403, 'Post does not belong to account');

        return await this.postRepository.update(id, data);
    }

    async reactionOnPost(
        authorId: number,
        postId: number,
        reaction: Reactions
    ) {
        return await this.postRepository.reactionOnPost(
            postId,
            authorId,
            reaction
        );
    }

    async getReactions(postId: number) {
        return this.postRepository.getReactions(postId);
    }

    async reportPost(
        authorId: number,
        postId: number,
        data: Prisma.ReportCreateInput
    ): Promise<ReportDto> {
        validateSchema(data, reportPostSchema);

        const post = await this.postRepository.getPost({ id: postId });

        if (!post) throw new HttpError(404, 'Post not found');

        const reportCreated = await this.postRepository.createReport(
            authorId,
            postId,
            data
        );

        if (!reportCreated) throw new HttpError(400, 'Something went wrong');

        await this.mailService.sendEmail({
            htmlTemplate: postReportHtml,
            subject: 'Post reported',
            toAddresses: await this.accountService.getAccountEmail(),
            textReplacer: (htmlData) =>
                htmlData.replaceAll(
                    'POST',
                    `${process.env.HOST}/api/posts/${postId}`
                ),
        });

        return reportCreated;
    }

    async getReports(accountId: number, postId: number) {
        const post = await this.postRepository.getPost({ id: postId });

        if (!post) throw new HttpError(404, 'Post not found');

        const account = await this.accountService.getAccount({
            id: accountId,
        });

        if (account?.role !== 'MODERATOR')
            throw new HttpError(403, 'Forbidden');

        return this.postRepository.getReports(postId);
    }

    async deletePost(accountId: number, id: number): Promise<PostDto> {
        let canDelete = true;
        const isAuthor = await this.postRepository.belongsTo(accountId, id);

        if (!isAuthor) {
            const account = await this.accountService.getAccount({
                id: accountId,
            });

            if (account?.role !== 'MODERATOR') canDelete = false;
        }

        if (!canDelete) throw new HttpError(403, 'Forbidden');

        await this.commentRepository.deleteAllComments(id);

        return await this.postRepository.delete(id);
    }
}
