import { Router } from 'express'
import { show, showSingle } from './controller'
import UserNotification, { schema } from './model'

const router = new Router({ mergeParams: true })

router.get('/:id/notification',
  show)

router.get('/:id/notification/:notificationId',
  showSingle)

export { UserNotification, schema }
export default router
