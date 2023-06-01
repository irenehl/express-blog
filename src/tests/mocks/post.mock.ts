import { ContentStatus, Reactions } from '@prisma/client';

export const postMock = {
    id: 1,
    content: 'Lorem ipsum dolor',
    status: 'PUBLISHED' as ContentStatus,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    authorId: 2,
};

export const allPostMock = [
    {
        id: 1,
        content: 'Lorem ipsum dolor',
        status: 'PUBLISHED' as ContentStatus,
        createdAt: '2023-05-22T13:44:12.106Z' as unknown as Date,
        updatedAt: '2023-05-22T13:44:12.106Z' as unknown as Date,
        authorId: 1,
    },
    {
        id: 2,
        content: 'Lorem ipsum dolor',
        status: 'PUBLISHED' as ContentStatus,
        createdAt: '2023-05-22T16:54:25.405Z' as unknown as Date,
        updatedAt: '2023-05-22T16:54:25.405Z' as unknown as Date,
        authorId: 2,
    },
    {
        id: 3,
        content: 'Lorem ipsum dolor',
        status: 'DRAFT' as ContentStatus,
        createdAt: '2023-05-22T20:33:39.532Z' as unknown as Date,
        updatedAt: '2023-05-22T20:33:39.532Z' as unknown as Date,
        authorId: 1,
    },
];

export const postReactionMock = {
    reaction: 'LIKE' as Reactions,
    postId: 3,
    authorId: 2,
};

export const allPostReactionsMock = [
    {
        reaction: 'LIKE' as Reactions,
        postId: 3,
        authorId: 2,
    },
    {
        reaction: 'LIKE' as Reactions,
        postId: 3,
        authorId: 1,
    },
    {
        reaction: 'LIKE' as Reactions,
        postId: 3,
        authorId: 3,
    },
];

export const reportMock = {
    id: 1,
    description: 'Lorem ipsum dolor',
    createdAt: new Date('2023-05-29T17:51:55.334Z'),
    authorId: 1,
    commentId: null,
    postId: 3,
};

export const allReportsMock = [
    {
        id: 1,
        description: 'Lorem ipsum dolor',
        createdAt: new Date('2023-05-29T17:51:55.334Z'),
        authorId: 1,
        commentId: null,
        postId: 3,
    },
    {
        id: 2,
        description: 'Lorem ipsum dolor',
        createdAt: new Date('2023-05-29T17:51:55.334Z'),
        authorId: 2,
        commentId: null,
        postId: 3,
    },
    {
        id: 3,
        description: 'Lorem ipsum dolor',
        createdAt: new Date('2023-05-29T17:51:55.334Z'),
        authorId: 3,
        commentId: null,
        postId: 3,
    },
];
