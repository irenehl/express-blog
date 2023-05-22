import { Prisma } from '@prisma/client';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { AccountService } from '../account/acount.service';
import { HttpError } from '../common/http-error';
import { PostDto } from './dto/post.dto';
import { Pagination } from '../common/interfaces/pagination';
import { CommentRepository } from '../comment/comment.repository';

export class PostService {
    private readonly postRepository: PostRepository;
    private readonly accountService: AccountService;
    private readonly commentRepository: CommentRepository;

    constructor() {
        this.postRepository = new PostRepository();
        this.accountService = new AccountService();
        this.commentRepository = new CommentRepository();
    }

    async createPost(accountId: number, data: CreatePostDto): Promise<PostDto> {
        const account = await this.accountService.getUser({ id: accountId });

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
        if (!data.id) throw new HttpError(400, 'id cannot be null');
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
        const isAuthor = await this.postRepository.belongsTo(authorId, id);

        if (!isAuthor)
            throw new HttpError(403, 'Post does not belong to account');

        return await this.postRepository.update(id, data);
    }

    async deletePost(authorId: number, id: number): Promise<PostDto> {
        const isAuthor = await this.postRepository.belongsTo(authorId, id);

        if (!isAuthor)
            throw new HttpError(403, 'Post does not belong to account');

        await this.commentRepository.deleteAllComments(id);

        return await this.postRepository.delete(id);
    }
}
