import { Router } from 'express'
import notification from './notification'
import user_notifications from './user-notifications'
import analytic from './analytic'
import device from './device'

const router = new Router()

router.use('/notifications', notification)
router.use('/user', user_notifications)
router.use('/analytics', analytic)
router.use('/devices', device)

export default router
