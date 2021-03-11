import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from "bodymen"
import { create, index, show } from './controller'
import { schema } from "../notification";

const router = new Router()
const { _id: notificationId } = schema.tree;

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

router.get('/',
  query({
    sender: {
      type: String,
      paths: ['sender']
    }
  }),
  index)

router.get('/:id',
  show)

export default router
