import { Router } from 'express'
import { AccountController } from './account.controller'

const router = Router()
const accountController = new AccountController()

router.post('/', accountController.createUser.bind(accountController))

router.get('/:id', accountController.getUser.bind(accountController))
router.get('/', accountController.getAll.bind(accountController))

router.patch('/:id', accountController.update.bind(accountController))

router.delete('/:id', accountController.delete.bind(accountController))

export default router
