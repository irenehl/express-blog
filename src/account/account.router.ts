import { Router } from 'express';
import { AccountController } from './account.controller';
import passport from 'passport';

const router = Router();
const accountController = new AccountController();

router.post('/', accountController.createAccount.bind(accountController));

router.get('/:id', accountController.getAccount.bind(accountController));
router.get('/', accountController.getAll.bind(accountController));

router.use(passport.authenticate('jwt', { session: false }));

router.patch('/:id', accountController.update.bind(accountController));

router.delete('/:id', accountController.delete.bind(accountController));

export default router;
