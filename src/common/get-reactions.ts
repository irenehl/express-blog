import { Reactions } from '@prisma/client';

export function getReactionsEnum(reaction: string) {
    switch (reaction) {
        case 'LIKE':
            return Reactions.LIKE;
        case 'DISLIKE':
            return Reactions.DISLIKE;
        case 'LOVE':
            return Reactions.LOVE;
        case 'ANGRY':
            return Reactions.ANGRY;
        case 'FUNNY':
            return Reactions.FUNNY;
    }

    return Reactions.LIKE;
}
