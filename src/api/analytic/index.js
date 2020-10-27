import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from "bodymen"
import { create, index, show } from './controller'
import { schema } from "../notification";

const router = new Router()
const { _id: notificationId } = schema.tree;

/**
 * @api {post} /analytics Register a new user event
 * @apiName RegisterEvent
 * @apiGroup Analytic
 * @apiSuccess {Object} userList User registers on that event.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.post('/',
  body({
    notificationId,
    event: {
      type: String,
      enum: ['clicked', 'received'],
      required: true,
    },
    userId: {
      type: String,
      required: true,
    }
  }),
  create)

/**
 * @api {get} /analytics Retrieve analytics
 * @apiName RetrieveAnalytics
 * @apiGroup Analytic
 * @apiUse listParams
 * @apiSuccess {Object[]} analytics List of events analytics of the notifications.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /analytics/:id Retrieve analytic
 * @apiName RetrieveAnalytic
 * @apiGroup Analytic
 * @apiSuccess {Object} analytics List of events analytics of the notifications.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Analytic not found.
 */
router.get('/:id',
  show)

export default router
