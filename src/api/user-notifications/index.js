import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { show, showDevices, showSingle, update } from './controller'
import UserNotification, { schema } from './model'

const router = new Router({ mergeParams: true })
const { deleted, seen } = schema.tree

router.get('/:id/notifications',
  show)

router.get('/:id/devices',
  showDevices)

router.get('/:id/notifications/:notificationId',
  showSingle)

router.put('/:id/notifications/:notificationId',
  body({ deleted, seen }),
  update)

router.delete('/:id/notifications/:notificationId',
  body({ deleted }),
  update)

export { UserNotification, schema }
export default router
