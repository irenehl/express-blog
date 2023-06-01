import { ContentStatus, Reactions } from '@prisma/client';

export const commentMock = {
    id: 1,
    content: 'Lorem ipsum',
    status: 'PUBLISHED' as ContentStatus,
    createdAt: new Date('2023-05-22T16:54:36.092Z'),
    updatedAt: new Date('2023-05-22T16:54:36.092Z'),
    authorId: 2,
    postId: 4,
};

export const allCommentsMock = [
    {
        id: 1,
        content: 'Lorem ipsum',
        status: 'PUBLISHED' as ContentStatus,
        createdAt: new Date('2023-05-22T16:54:36.092Z'),
        updatedAt: new Date('2023-05-22T16:54:36.092Z'),
        authorId: 2,
        postId: 1,
    },
    {
        id: 1,
        content: 'Lorem ipsum dolor',
        status: 'DRAFT' as ContentStatus,
        createdAt: new Date('2023-05-22T16:54:37.445Z'),
        updatedAt: new Date('2023-05-22T16:54:37.445Z'),
        authorId: 2,
        postId: 1,
    },
    {
        id: 1,
        content: 'Lorem ipsum dolor sit',
        status: 'DRAFT' as ContentStatus,
        createdAt: new Date('2023-05-22T16:54:44.098Z'),
        updatedAt: new Date('2023-05-22T16:54:44.098Z'),
        authorId: 2,
        postId: 1,
    },
];

export const updatedCommentMock = {
    id: 1,
    content: 'Lorem ipsum',
    status: 'DRAFT' as ContentStatus,
    createdAt: new Date('2023-05-22T16:54:36.092Z'),
    updatedAt: new Date('2023-05-22T16:54:36.092Z'),
    authorId: 2,
    postId: 4,
};

export const commentReactionMock = {
    reaction: 'ANGRY' as Reactions,
    commentId: 2,
    authorId: 3,
};

export const allCommentReactionsMock = [
    {
        reaction: 'LOVE' as Reactions,
        commentId: 1,
        authorId: 2,
    },
    {
        reaction: 'LOVE' as Reactions,
        commentId: 1,
        authorId: 1,
    },
];

export const commentReportMock = {
    id: 1,
    description: 'lorem ipsum dolor sit',
    createdAt: new Date('2023-05-29T17:41:54.802Z'),
    authorId: 2,
    commentId: 1,
    postId: null,
};

export const allReportsOnCommentsMock = [
    {
        id: 1,
        description: 'lorem ipsum dolor sit',
        createdAt: new Date('2023-05-29T17:41:54.802Z'),
        authorId: 1,
        commentId: 1,
        postId: null,
    },
    {
        id: 1,
        description: 'lorem ipsum dolor sit',
        createdAt: new Date('2023-05-29T17:41:54.802Z'),
        authorId: 2,
        commentId: 1,
        postId: null,
    },
];
