import { HttpError } from '../common/http-error';
import {
    allAccountsMock,
    modAccountFactoryMock,
    userAccountMock,
} from '../tests/mocks/account.mock';
import {
    allCommentReactionsMock,
    allCommentsMock,
    allReportsOnCommentsMock,
    commentMock,
    commentReactionMock,
    commentReportMock,
    updatedCommentMock,
} from '../tests/mocks/comment.mock';
import { postMock } from '../tests/mocks/post.mock';
import { prismaMock } from '../tests/mocks/prisma.mock';
import { CommentService } from './comment.service';

describe('CommentService', () => {
    let commentService: CommentService;

    beforeEach(() => {
        commentService = new CommentService(prismaMock);
    });

    describe('/posts/:id/comments', () => {
        it('Should create a new comment on a post', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.post.findUnique.mockResolvedValue(postMock);
            prismaMock.comment.create.mockResolvedValue(commentMock);

            const result = await commentService.createComment(
                userAccountMock.id,
                postMock.id,
                {
                    content: 'Lorem ipsum dolor',
                    status: 'PUBLISHED',
                }
            );

            expect(result).toMatchObject(commentMock);
        });

        it('Should fail when account does not exists', async () => {
            prismaMock.account.findUnique.mockResolvedValue(null);
            prismaMock.post.findUnique.mockResolvedValue(postMock);

            await expect(
                commentService.createComment(userAccountMock.id, postMock.id, {
                    content: 'Lorem ipsum dolor',
                    status: 'PUBLISHED',
                })
            ).rejects.toThrow('Account not found');
        });

        it('Should fail when post does not exists', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.post.findUnique.mockResolvedValue(null);

            await expect(
                commentService.createComment(userAccountMock.id, 1000, {
                    content: 'Lorem ipsum dolor',
                    status: 'PUBLISHED',
                })
            ).rejects.toThrow('Post not found');
        });

        it('Should returna all comments from a post', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.post.findUnique.mockResolvedValue(postMock);
            prismaMock.comment.findMany.mockResolvedValue(allCommentsMock);

            const result = await commentService.getAllComments(postMock.id, {
                page: 1,
                limit: 15,
            });

            expect(result).toMatchObject(allCommentsMock);
        });

        it('Should fail when try to return all comments from a post that does not exists', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.post.findUnique.mockResolvedValue(null);

            await expect(
                commentService.getAllComments(1000, {
                    page: 1,
                    limit: 15,
                })
            ).rejects.toThrow('Post not found');
        });
    });

    describe('/comments/:id', () => {
        it('Should update a comment', async () => {
            prismaMock.account.findFirstOrThrow.mockResolvedValue(
                userAccountMock
            );
            prismaMock.comment.findFirst.mockResolvedValue(commentMock);
            prismaMock.comment.findUnique.mockResolvedValue(commentMock);
            prismaMock.comment.update.mockResolvedValue(updatedCommentMock);

            const result = await commentService.updateComment(
                userAccountMock.id,
                commentMock.authorId,
                {
                    status: 'DRAFT',
                }
            );

            expect(result?.status).toEqual('DRAFT');
        });

        it('Should fail when update a comment when account is not the author', async () => {
            prismaMock.account.findFirstOrThrow.mockResolvedValue(
                modAccountFactoryMock()
            );
            prismaMock.comment.findFirst.mockResolvedValue(commentMock);
            prismaMock.comment.findUnique.mockResolvedValue(commentMock);
            prismaMock.comment.update.mockResolvedValue(updatedCommentMock);

            await expect(
                commentService.updateComment(
                    modAccountFactoryMock().id,
                    commentMock.authorId,
                    {
                        status: 'DRAFT',
                    }
                )
            ).rejects.toThrow('Comment does not belong to account');
        });

        it('Should fail when update a comment that does not exists', async () => {
            prismaMock.account.findFirstOrThrow.mockResolvedValue(
                userAccountMock
            );
            prismaMock.comment.findFirst.mockResolvedValue(commentMock);
            prismaMock.comment.findUnique.mockResolvedValue(null);

            await expect(
                commentService.updateComment(userAccountMock.id, 10000, {
                    status: 'DRAFT',
                })
            ).rejects.toThrow('Something went wrong');
        });

        it('Should delete a specific comment when account is author', async () => {
            prismaMock.account.findFirst.mockResolvedValue(userAccountMock);
            prismaMock.comment.findFirst.mockResolvedValue(commentMock);

            prismaMock.comment.delete.mockResolvedValue(commentMock);

            const result = await commentService.deleteComment(
                commentMock.authorId,
                userAccountMock.id
            );

            expect(result).toMatchObject(commentMock);
        });

        it('Should delete a specific comment when account is moderator', async () => {
            const account = modAccountFactoryMock();

            prismaMock.account.findFirst.mockResolvedValue(account);
            prismaMock.account.findUnique.mockResolvedValue(account);
            prismaMock.comment.findFirst.mockResolvedValue(commentMock);

            prismaMock.comment.delete.mockResolvedValue(commentMock);

            const result = await commentService.deleteComment(
                commentMock.authorId,
                account.id
            );

            expect(result).toMatchObject(commentMock);
        });

        it('Should fail when delete a specific comment when account is neither mod or author', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.comment.findFirst.mockResolvedValue(null);

            prismaMock.comment.delete.mockResolvedValue(commentMock);

            await expect(
                commentService.deleteComment(
                    commentMock.authorId,
                    userAccountMock.id
                )
            ).rejects.toThrow('Forbidden');
        });
    });

    describe('comments/:id/reactions', () => {
        it('Should patch a reaction to a comment', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.comment.findUnique.mockResolvedValue(commentMock);
            prismaMock.reactionsOnComments.upsert.mockResolvedValue(
                commentReactionMock
            );

            const result = await commentService.reactionOnComment(
                userAccountMock.id,
                commentMock.id,
                'ANGRY'
            );

            expect(result).toMatchObject(commentReactionMock);
        });

        it('Should remove a reaction when is NULL', async () => {
            prismaMock.comment.findUnique.mockResolvedValue(commentMock);
            prismaMock.reactionsOnComments.findUnique.mockResolvedValue(
                commentReactionMock
            );
            prismaMock.reactionsOnComments.delete.mockResolvedValue(
                commentReactionMock
            );

            const result = await commentService.reactionOnComment(
                userAccountMock.id,
                commentMock.id,
                'NULL'
            );

            expect(result).toMatchObject(commentReactionMock);
        });

        it('Should return null if the comment does not have any reaction', async () => {
            prismaMock.comment.findUnique.mockResolvedValue(commentMock);
            prismaMock.reactionsOnComments.findUnique.mockResolvedValue(null);

            const result = await commentService.reactionOnComment(
                userAccountMock.id,
                commentMock.id,
                'NULL'
            );

            expect(result).toBe(null);
        });

        it('Should return all reaction from a comment', async () => {
            prismaMock.comment.findUnique.mockResolvedValue(commentMock);
            prismaMock.reactionsOnComments.findMany.mockResolvedValue(
                allCommentReactionsMock
            );

            const result = await commentService.getReactions(commentMock.id);

            expect(result).toMatchObject(allCommentReactionsMock);
            expect(result).toHaveLength(2);
        });

        it('Should fail when return all reaction from a comment that does not exists', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.comment.findUnique.mockResolvedValue(null);

            await expect(
                commentService.reactionOnComment(
                    userAccountMock.id,
                    1000,
                    'LIKE'
                )
            ).rejects.toThrow('Comment not found');
        });
    });

    describe('comments/:id/reports', () => {
        it('Should create a new report', async () => {
            prismaMock.account.findMany.mockResolvedValue(allAccountsMock);
            prismaMock.account.findFirst.mockResolvedValue(userAccountMock);
            prismaMock.comment.findUnique.mockResolvedValue(commentMock);
            prismaMock.report.create.mockResolvedValue(commentReportMock);

            const result = await commentService.reportComment(
                userAccountMock.id,
                commentMock.id,
                {
                    description: 'Lorem ipsum dolor',
                    author: {
                        connect: {
                            id: userAccountMock.id,
                        },
                    },
                }
            );

            expect(result).toMatchObject(commentReportMock);
            expect(result.commentId).toEqual(1);
        });

        it('Should fail when create a new report if comment does not exists', async () => {
            prismaMock.comment.findUnique.mockResolvedValue(null);

            await expect(
                commentService.reportComment(
                    userAccountMock.id,
                    commentMock.id,
                    {
                        description: 'Lorem ipsum dolor',
                        author: {
                            connect: {
                                id: userAccountMock.id,
                            },
                        },
                    }
                )
            ).rejects.toThrow('Comment not found');
        });

        it('Should return all the reports from a post', async () => {
            const account = modAccountFactoryMock();

            prismaMock.account.findUnique.mockResolvedValue(account);
            prismaMock.comment.findUnique.mockResolvedValue(commentMock);
            prismaMock.report.findMany.mockResolvedValue(
                allReportsOnCommentsMock
            );

            const result = await commentService.getReports(
                account.id,
                commentMock.id
            );

            expect(result).toHaveLength(2);
            expect(result).toMatchObject(allReportsOnCommentsMock);
        });

        it('Should fail when return all the reports from a comment that does not exists', async () => {
            const account = modAccountFactoryMock();

            prismaMock.account.findUnique.mockResolvedValue(account);
            prismaMock.comment.findUnique.mockResolvedValue(null);
            prismaMock.report.findMany.mockResolvedValue(
                allReportsOnCommentsMock
            );

            await expect(
                commentService.getReports(account.id, commentMock.id)
            ).rejects.toThrow('Comment not found');
        });

        it('Should fail when trying to get reports without auth', async () => {
            prismaMock.account.findUnique.mockResolvedValue(userAccountMock);
            prismaMock.comment.findUnique.mockResolvedValue(commentMock);
            prismaMock.report.findMany.mockResolvedValue(
                allReportsOnCommentsMock
            );

            await expect(
                commentService.getReports(userAccountMock.id, commentMock.id)
            ).rejects.toThrow('Forbidden');
        });
    });
});
