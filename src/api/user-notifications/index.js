import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { show, showDevices, showSingle, update } from './controller'
import UserNotification, { schema } from './model'

const router = new Router({ mergeParams: true })
const { deleted, seen } = schema.tree

router.get('/:id/notification',
  show)

router.get('/:id/devices',
  showDevices)

router.get('/:id/notification/:notificationId',
  showSingle)

router.put('/:id/notification/:notificationId',
  body({ deleted, seen }),
  update)

router.delete('/:id/notification/:notificationId',
  body({ deleted }),
  update)

export { UserNotification, schema }
export default router
