import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login.bind(authController));
router.post(
    '/recover/request',
    authController.recoverRequest.bind(authController)
);
router.post(
    '/recover/reset/:recoveryToken',
    authController.resetPassword.bind(authController)
);

export default router;
