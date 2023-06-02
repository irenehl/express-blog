import aws from '../config/aws';
import {
    allAccountsMock,
    modAccountFactoryMock,
    userAccountMock,
} from '../tests/mocks/account.mock';
import { allCommentsMock } from '../tests/mocks/comment.mock';
import {
    allPostMock,
    allPostReactionsMock,
    allReportsMock,
    postMock,
    postReactionMock,
    reportMock,
} from '../tests/mocks/post.mock';
import { prismaMock } from '../tests/mocks/prisma.mock';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

let postService: PostService;

jest.mock('../config/aws', () => {
    const ses = {
        send: jest.fn(),
    };

    return ses;
});

describe('PostService', () => {
    beforeEach(() => {
        postService = new PostService(aws, prismaMock);
    });

    describe('/posts', () => {
        it('Should create a new post', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.post.create.mockResolvedValue(postMock);

            const data: CreatePostDto = {
                content: 'Lorem ipsum dolor',
                status: 'PUBLISHED',
            };

            const result = await postService.createPost(
                userAccountMock.id,
                data
            );

            expect(result).toEqual(postMock);
        });

        it('Should get all post', async () => {
            prismaMock.post.findMany.mockResolvedValue(allPostMock);

            const result = await postService.getAll({
                page: 1,
                limit: 15,
            });

            expect(result).toHaveLength(3);
            expect(result).toEqual(allPostMock);
        });
    });

    describe('/posts/:id', () => {
        it('Should get an specific post', async () => {
            prismaMock.post.findUnique.mockResolvedValue(postMock);

            const result = await postService.getPost({ id: 1 });

            expect(result).toEqual(postMock);
        });

        it('Should fail with 404 when post not found', async () => {
            prismaMock.post.findUnique.mockResolvedValue(null);

            await expect(postService.getPost({ id: 100 })).rejects.toThrow(
                'Post not found'
            );
        });

        it('Should update a post', async () => {
            prismaMock.post.findFirst.mockResolvedValue(postMock);
            prismaMock.post.update.mockResolvedValue({
                ...postMock,
                content: 'Updated post',
            });

            const data = {
                content: 'Updated post',
            };

            const result = await postService.updatePost(
                userAccountMock.id,
                postMock.id,
                data
            );

            expect(result).toHaveProperty('content');
            expect(result.content).toEqual('Updated post');
        });

        it('Should fail when trying to update a post without authorization', async () => {
            prismaMock.post.findFirst.mockResolvedValue(null);
            prismaMock.post.update.mockRejectedValueOnce(postMock);

            const data = {
                content: 'Updated post',
            };

            await expect(
                postService.updatePost(userAccountMock.id, postMock.id, data)
            ).rejects.toThrow('Post does not belong to account');
        });

        it('Should delete a specific post when account is author', async () => {
            prismaMock.post.findFirst.mockResolvedValue(postMock);
            prismaMock.comment.deleteMany.mockResolvedValue({
                count: allCommentsMock.length,
            });
            prismaMock.post.delete.mockResolvedValue(postMock);

            const result = await postService.deletePost(
                userAccountMock.id,
                postMock.id
            );

            expect(result).toMatchObject(postMock);
        });

        it('Should delete a specific post when account is moderator', async () => {
            const account = modAccountFactoryMock();

            prismaMock.account.findUnique.mockResolvedValue(account);
            prismaMock.post.delete.mockResolvedValue(postMock);

            const result = await postService.deletePost(
                account.id,
                postMock.id
            );

            expect(result).toMatchObject(postMock);
        });

        it('Should fail with 404 when account is not found', async () => {
            prismaMock.post.findFirst.mockResolvedValue(null);
            prismaMock.comment.deleteMany.mockResolvedValue({
                count: allCommentsMock.length,
            });
            prismaMock.account.findUnique.mockResolvedValue(null);

            await expect(
                postService.deletePost(userAccountMock.id, postMock.id)
            ).rejects.toThrow('Account not found');
        });

        it('Should fail when account is neither mod or author', async () => {
            prismaMock.post.findFirst.mockResolvedValue(null);

            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);

            await expect(
                postService.deletePost(userAccountMock.id, postMock.id)
            ).rejects.toThrow('Forbidden');
        });
    });

    describe('/posts/:id/reactions', () => {
        it('Should patch a reaction to a post', async () => {
            prismaMock.reactionsOnPosts.upsert.mockResolvedValue(
                postReactionMock
            );

            const result = await postService.reactionOnPost(2, 1, 'LIKE');

            expect(result).toMatchObject(postReactionMock);
        });

        it('Should remove a reaction when reaction is NULL', async () => {
            prismaMock.reactionsOnPosts.findUnique.mockResolvedValue(
                postReactionMock
            );
            prismaMock.reactionsOnPosts.delete.mockResolvedValue(
                postReactionMock
            );

            const result = await postService.reactionOnPost(1, 1, 'NULL');

            expect(result).toMatchObject(postReactionMock);
        });

        it('Should return null if the post does not have any reactions', async () => {
            prismaMock.reactionsOnPosts.findUnique.mockResolvedValue(null);
            prismaMock.reactionsOnPosts.delete.mockResolvedValue(
                postReactionMock
            );

            const result = await postService.reactionOnPost(1, 1, 'NULL');

            expect(result).toBe(null);
        });

        it('Should get all reactions from a post', async () => {
            prismaMock.reactionsOnPosts.findMany.mockResolvedValue(
                allPostReactionsMock
            );

            const result = await postService.getReactions(3);

            expect(result).toMatchObject(allPostReactionsMock);
            expect(result).toHaveLength(3);
        });
    });

    describe('/posts/:id/reports', () => {
        it('Should create a new report', async () => {
            prismaMock.account.findMany.mockResolvedValue(allAccountsMock);
            prismaMock.account.findFirst.mockResolvedValue(userAccountMock);
            prismaMock.post.findUnique.mockResolvedValue(postMock);
            prismaMock.report.create.mockResolvedValue(reportMock);

            const result = await postService.reportPost(
                userAccountMock.id,
                postMock.id,
                {
                    description: 'Lorem ipsum dolor',
                    author: {
                        connect: {
                            id: userAccountMock.id,
                        },
                    },
                }
            );

            expect(aws.send).toHaveBeenCalled();
            expect(result).toMatchObject(reportMock);
            expect(result.postId).toEqual(3);
        });

        it('Should fail when create a new report if post does not exists', async () => {
            prismaMock.account.findMany.mockResolvedValue(allAccountsMock);
            prismaMock.account.findFirst.mockResolvedValue(userAccountMock);
            prismaMock.post.findUnique.mockResolvedValue(null);
            prismaMock.report.create.mockResolvedValue(reportMock);

            await expect(
                postService.reportPost(userAccountMock.id, postMock.id, {
                    description: 'Lorem ipsum dolor',
                    author: {
                        connect: {
                            id: userAccountMock.id,
                        },
                    },
                })
            ).rejects.toThrow('Post not found');
        });

        it('Should fail with 404 when post not found', async () => {
            prismaMock.post.findUnique.mockResolvedValue(null);

            await expect(postService.getPost({ id: 1000 })).rejects.toThrow(
                'Post not found'
            );
        });

        it('Should fail with 400 when report post cannot be created', async () => {
            prismaMock.post.findUnique.mockResolvedValue(postMock);

            await expect(
                postService.reportPost(1, 1, {
                    description: 'Lorem ipsum dolor',
                    author: {
                        connect: {
                            id: userAccountMock.id,
                        },
                    },
                })
            ).rejects.toThrow('Something went wrong');
        });

        it('Should return all the reports from a post', async () => {
            const account = modAccountFactoryMock();

            prismaMock.account.findUnique.mockResolvedValue(account);
            prismaMock.post.findUnique.mockResolvedValue(postMock);
            prismaMock.report.findMany.mockResolvedValue(allReportsMock);

            const result = await postService.getReports(
                account.id,
                postMock.id
            );

            expect(result).toHaveLength(3);
            expect(result).toMatchObject(allReportsMock);
        });

        it('Should fail when return all the reports from a post that does not exists', async () => {
            const account = modAccountFactoryMock();

            prismaMock.account.findUnique.mockResolvedValue(account);
            prismaMock.post.findUnique.mockResolvedValue(null);
            prismaMock.report.findMany.mockResolvedValue(allReportsMock);

            await expect(
                postService.getReports(account.id, postMock.id)
            ).rejects.toThrow('Post not found');
        });

        it('Should fail when trying to get reports wihtout auth', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.post.findUnique.mockResolvedValue(postMock);
            prismaMock.report.findMany.mockResolvedValue(allReportsMock);

            await expect(
                postService.getReports(userAccountMock.id, postMock.id)
            ).rejects.toThrow('Forbidden');
        });
    });
});
