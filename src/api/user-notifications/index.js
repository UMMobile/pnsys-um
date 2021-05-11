import { Router } from 'express'
import { show } from './controller'
import UserNotification, { schema } from './model'

const router = new Router({ mergeParams: true })

router.get('/:id/notification',
  show)

export { UserNotification, schema }
export default router
