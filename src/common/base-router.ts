import { Router } from 'express';
import accountRouter from '../account/account.router';
import authRouter from '../auth/auth.router';
import postRouter from '../post/post.router';

const router = Router();

router.use('/account', accountRouter);
router.use('/auth', authRouter);
router.use('/post', postRouter);

export default router;
