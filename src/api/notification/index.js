import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, cancel } from './controller'
import Notification, { schema } from './model'

const router = new Router({mergeParams: true})
const { appId, message, options } = schema.tree

/**
 * @api {post} /notifications Create notification
 * @apiName CreateNotification
 * @apiGroup Notification
 * @apiParam message Notification's message.
 * @apiParam options Notification's options.
 * @apiSuccess {Object} notification Notification's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.post('/',
  body({ message, options: {} }),
  create)

/**
 * @api {get} /notifications Retrieve notifications
 * @apiName RetrieveNotifications
 * @apiGroup Notification
 * @apiUse listParams
 * @apiSuccess {Object[]} notifications List of notifications.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /notifications/:id Retrieve notification
 * @apiName RetrieveNotification
 * @apiGroup Notification
 * @apiSuccess {Object} notification Notification's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Notification not found.
 */
router.get('/:id',
  show)

/**
 * @api {delete} /notifications/:id Cancel schedule notification
 * @apiName CancelNotification
 * @apiGroup Notification
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Notification not found.
 */
router.put('/:id/cancel',
  cancel)

export { Notification, schema }
export default router
