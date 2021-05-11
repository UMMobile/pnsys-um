import { Router } from 'express'
import { middleware as query } from 'querymen'
import { index, show, validExternals } from './controller'

const router = new Router()

router.get('/',
  query(),
  index)

router.get('/externalIds',
  validExternals)

router.get('/:id',
  show)

export default router
