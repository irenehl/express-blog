import { Router } from 'express';
import { AccountController } from './account.controller';
import passport from 'passport';

const router = Router();
const accountController = new AccountController();

router.post('/', accountController.createUser.bind(accountController));

router.get('/:id', accountController.getUser.bind(accountController));
router.get('/', accountController.getAll.bind(accountController));

router.patch(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    accountController.update.bind(accountController)
);

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    accountController.delete.bind(accountController)
);

export default router;
