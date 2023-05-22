import { Prisma } from '@prisma/client';
import { AccountService } from '../account/acount.service';
import { Pagination } from '../common/interfaces/pagination';
import { PostService } from '../post/post.service';
import { CommentRepository } from './comment.repository';
import { CommentDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { HttpError } from '../common/http-error';

export class CommentService {
    private readonly commentRepository: CommentRepository;
    private readonly accountService: AccountService;
    private readonly postService: PostService;

    constructor() {
        this.commentRepository = new CommentRepository();
        this.accountService = new AccountService();
        this.postService = new PostService();
    }

    async createComment(
        accountId: number,
        postId: number,
        data: CreateCommentDto
    ): Promise<CommentDto> {
        const account = await this.accountService.getUser({ id: accountId });
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
        postId: number,
        data: Prisma.CommentUpdateInput
    ): Promise<CommentDto | null> {
        const isAuthor = await this.commentRepository.belongsTo(
            authorId,
            commentId
        );

        if (!isAuthor)
            throw new HttpError(403, 'Comment does not belong to account');

        const post = await this.postService.getPost({ id: postId });

        if (!post) throw new HttpError(404, 'Post not found');

        const updatedComment = await this.commentRepository.updateComment(
            commentId,
            postId,
            data
        );

        if (!updatedComment) throw new HttpError(400, 'Something went wrong');

        console.log(commentId);

        return await this.commentRepository.getOne({ id: commentId });
    }

    async deleteComment(
        commentId: number,
        authorId: number,
        postId: number
    ): Promise<CommentDto> {
        const isAuthor = await this.commentRepository.belongsTo(
            authorId,
            commentId
        );

        if (!isAuthor)
            throw new HttpError(403, 'Comment does not belong to account');

        const post = await this.postService.getPost({ id: postId });

        if (!post) throw new HttpError(404, 'Post not found');

        return await this.commentRepository.delete(commentId);
    }
}
