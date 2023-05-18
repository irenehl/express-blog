import { Prisma } from '@prisma/client';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { AccountService } from '../account/acount.service';
import { IPagionation } from '../common/pagination-interface';
import { HttpError } from '../common/http-error';
import { PostDto } from './dto/post.dto';

export class PostService {
    private readonly postRepository: PostRepository;
    private readonly accountService: AccountService;

    constructor() {
        this.postRepository = new PostRepository();
        this.accountService = new AccountService();
    }

    async createPost(accountId: number, data: CreatePostDto): Promise<PostDto> {
        const account = await this.accountService.getUser({ id: accountId });

        return this.postRepository.create({
            author: {
                connect: {
                    id: account.id,
                },
            },
            ...data,
        });
    }

    async getPost(data: Prisma.PostWhereUniqueInput): Promise<PostDto | null> {
        return this.postRepository.getPost(data);
    }

    async getAll(data: IPagionation): Promise<PostDto[]> {
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

        return await this.postRepository.update(authorId, id, data);
    }

    async deletePost(authorId: number, id: number): Promise<PostDto> {
        const isAuthor = await this.postRepository.belongsTo(authorId, id);

        if (!isAuthor)
            throw new HttpError(403, 'Post does not belong to account');

        return await this.postRepository.delete(id);
    }
}
