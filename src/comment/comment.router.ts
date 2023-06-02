import { Router } from 'express';
import passport from 'passport';
import { CommentController } from './comment.controller';

const router = Router();
const commentController = new CommentController();

router.get(
    '/:id/reactions',
    commentController.getReactions.bind(commentController)
);

router.use(passport.authenticate('jwt', { session: false }));

router.post(
    '/:id/reports',
    commentController.createReport.bind(commentController)
);

router.get(
    '/:id/reports',
    commentController.getReports.bind(commentController)
);

router.patch('/:id', commentController.updateComment.bind(commentController));
router.patch(
    '/:id/reactions',
    commentController.reactionOnComment.bind(commentController)
);

router.delete('/:id', commentController.deleteComment.bind(commentController));

export default router;
