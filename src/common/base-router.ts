import { Router } from 'express';
import accountRouter from '../account/account.router';
import authRouter from '../auth/auth.router';
import postRouter from '../post/post.router';

const router = Router();

router.use('/accounts', accountRouter);
router.use('/auth', authRouter);
router.use('/posts', postRouter);

export default router;
