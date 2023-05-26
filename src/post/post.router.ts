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
    '/:id/comments',
    passport.authenticate('jwt', { session: false }),
    commentController.create.bind(commentController)
);
router.post(
    '/:id/reports',
    passport.authenticate('jwt', { session: false }),
    postController.createReport.bind(postController)
);

router.get('/', postController.getAll.bind(postController));
router.get('/:id', postController.getPost.bind(postController));
router.get('/:id/reactions', postController.getReaction.bind(postController));
router.get(
    '/:id/comments',
    commentController.getComments.bind(commentController)
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

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    postController.deletePost.bind(postController)
);

export default router;
