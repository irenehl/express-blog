import { ContentStatus } from '@prisma/client';

export type CreateCommentDto = {
    content: string;
    status: ContentStatus;
};
