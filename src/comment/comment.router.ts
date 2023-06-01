import { Router } from 'express';
import passport from 'passport';
import { CommentController } from './comment.controller';

const router = Router();
const commentController = new CommentController();

router.post(
    '/:id/reports',
    passport.authenticate('jwt', { session: false }),
    commentController.createReport.bind(commentController)
);

router.get(
    '/:id/reactions',
    commentController.getReactions.bind(commentController)
);
router.get(
    '/:id/reports',
    commentController.getReports.bind(commentController)
);

router.patch(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    commentController.updateComment.bind(commentController)
);
router.patch(
    '/:id/reactions',
    passport.authenticate('jwt', { session: false }),
    commentController.reactionOnComment.bind(commentController)
);

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    commentController.deleteComment.bind(commentController)
);

export default router;
