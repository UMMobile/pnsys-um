import { Router } from 'express'
import notification from './notification'
import analytic from './analytic'

const router = new Router()

router.use('/notifications', notification)
router.use('/analytics', analytic)

export default router
