import { Router } from 'express';
import { PostController } from './post.controller';
import passport from 'passport';

const router = Router();
const postController = new PostController();

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    postController.create.bind(postController)
);

router.get('/:id', postController.getPost.bind(postController));
router.get('/', postController.getAll.bind(postController));

router.patch(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    postController.updatePost.bind(postController)
);

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    postController.deletePost.bind(postController)
);

export default router;
