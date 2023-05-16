import { Router } from 'express'
import accountRouter from '../account/account.router'
import authRouter from '../auth/auth.router'

const router = Router()

router.use('/account', accountRouter)
router.use('/auth', authRouter)

export default router
