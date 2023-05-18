import { ContentStatus } from '@prisma/client';

export type CreatePostDto = {
    content: string;
    status: ContentStatus;
};
