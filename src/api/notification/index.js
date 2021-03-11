import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, cancel } from './controller'
import Notification, { schema } from './model'

const router = new Router({ mergeParams: true })
const { message, sender } = schema.tree

router.post('/',
  body({ message, options: {}, sender }),
  create)

router.get('/',
  query({ sender: { type: String, paths: ['sender'] } }),
  index)

router.get('/:id',
  show)

router.put('/:id/cancel',
  cancel)

export { Notification, schema }
export default router
