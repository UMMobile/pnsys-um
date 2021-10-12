import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { middleware as query } from 'querymen'
import { show, showDevices, showSingle, validExternals, update } from './controller'
import UserNotification, { schema } from './model'

const router = new Router({ mergeParams: true })
const { deleted, seen } = schema.tree

router.get('',
  validExternals)

router.get('/:id/notifications',
  query({ignoreDeleted: { type: Boolean, paths: ['ignoreDeleted'] }}),
  show)

router.get('/:id/devices',
  showDevices)

router.get('/:id/notifications/:notificationId',
  query({ignoreDeleted: { type: Boolean, paths: ['ignoreDeleted'] }}),
  showSingle)

router.put('/:id/notifications/:notificationId',
  body({ deleted, seen }),
  update)

router.delete('/:id/notifications/:notificationId',
  body({ deleted }),
  update)

export { UserNotification, schema }
export default router
