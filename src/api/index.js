import { Router } from 'express'
import notification from './notification'
import analytic from './analytic'
import device from './device'

const router = new Router()

router.use('/notifications', notification)
router.use('/analytics', analytic)
router.use('/devices', device)

export default router
