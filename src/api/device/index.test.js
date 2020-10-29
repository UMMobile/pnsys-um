import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes from '.'

const app = () => express(apiRoot, routes)

test('GET /devices 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body).toHaveProperty('limit', 100)
})