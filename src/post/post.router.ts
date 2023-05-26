import { Router } from 'express';
import { PostController } from './post.controller';
import passport from 'passport';
import { CommentController } from '../comment/comment.controller';

const router = Router();
const postController = new PostController();
const commentController = new CommentController();

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    postController.create.bind(postController)
);
router.post(
    '/:id/reports',
    passport.authenticate('jwt', { session: false }),
    postController.createReport.bind(postController)
);
router.post(
    '/:id/comments',
    passport.authenticate('jwt', { session: false }),
    commentController.create.bind(commentController)
);
router.post(
    '/:postId/comments/:commentId/reports',
    passport.authenticate('jwt', { session: false }),
    commentController.createReport.bind(commentController)
);

router.get('/', postController.getAll.bind(postController));
router.get('/:id', postController.getPost.bind(postController));
router.get('/:id/reactions', postController.getReaction.bind(postController));
router.get(
    '/:id/comments',
    commentController.getComments.bind(commentController)
);
router.get(
    '/:postId/comments/:commentId/reactions',
    commentController.getReactions.bind(commentController)
);

router.patch(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    postController.updatePost.bind(postController)
);
router.patch(
    '/:id/reactions',
    passport.authenticate('jwt', { session: false }),
    postController.reactionOnPost.bind(postController)
);
router.patch(
    '/:postId/comments/:commentId',
    passport.authenticate('jwt', { session: false }),
    commentController.updateComment.bind(commentController)
);
router.patch(
    '/:postId/comments/:commentId/reactions',
    passport.authenticate('jwt', { session: false }),
    commentController.reactionOnComment.bind(commentController)
);

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    postController.deletePost.bind(postController)
);
router.delete(
    '/:postId/comments/:commentId',
    passport.authenticate('jwt', { session: false }),
    commentController.deleteComment.bind(commentController)
);

export default router;
