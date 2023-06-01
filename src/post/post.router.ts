import { Router } from 'express';
import { PostController } from './post.controller';
import passport from 'passport';
import { CommentController } from '../comment/comment.controller';
import modGuard from '../auth/auth.guard';

const router = Router();
const postController = new PostController();
const commentController = new CommentController();

// Without auth
router.get('/', postController.getAll.bind(postController));
router.get('/:id', postController.getPost.bind(postController));
router.get('/:id/reactions', postController.getReaction.bind(postController));
router.get(
    '/:id/comments',
    commentController.getComments.bind(commentController)
);

// With auth
router.use(passport.authenticate('jwt', { session: false }));

router.post('/', postController.create.bind(postController));
router.post('/:id/comments', commentController.create.bind(commentController));
router.post('/:id/reports', postController.reportPost.bind(postController));

router.get(
    '/:id/reports',
    modGuard,
    postController.getReports.bind(postController)
);

router.patch('/:id', postController.updatePost.bind(postController));
router.patch(
    '/:id/reactions',
    postController.reactionOnPost.bind(postController)
);

router.delete('/:id', postController.deletePost.bind(postController));

export default router;
