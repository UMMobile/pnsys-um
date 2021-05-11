import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Notification } from '.'

const app = () => express(apiRoot, routes)

let notification

beforeEach(async () => {
  notification = await Notification.create({
    _id: "1adc99d6-7f73-48bf-b3d8-49491f684986",
    message: {
      heading: {
        en: "Example",
        es: "Ejemplo"
      },
      content: {
        en: "This is an example",
        es: "Este es un ejemplo"
      }
    },
    options: {
      targets: {
        to: {
          type: "externals",
          value: [
            "1170938"
          ]
        }
      }
    },
    response: {
      id: "1adc99d6-7f73-48bf-b3d8-49491f684986",
      recipients: 1,
      external_id: null
    }
  })
})

test('POST /notifications 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send(notification)
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.message.heading.en).toEqual('Example')
  expect(body.options.targets.to.type).toEqual('externals')
})

test('POST /notifications 400', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send()
  expect(status).toBe(400)
})

test('GET /notifications 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query()
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /notifications/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${notification._id}`)
    .query()
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body._id).toEqual(notification._id)
})

test('GET /notifications/:id 404', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/123456789098765432123456`)
    .query()
  expect(status).toBe(404)
})

test('Schedule & Cancel notification 204', async () => {
  expect.assertions(2)

  const tomorrow = () => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return date.toString();
  }

  notification.options.extra = {
    send_after: tomorrow()
  }

  const { status: status_created, body } = await request(app())
    .post(`${apiRoot}`)
    .send(notification)
  expect(status_created).toBe(201)
  
  let scheduled = {...body}
  const { status: status_canceled } = await request(app())
    .put(`${apiRoot}/${scheduled._id}/cancel`)
    .query()
  expect(status_canceled).toBe(204)
})

test('Cancel notification 404', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/123456789098765432123456/cancel`)
    .query()
  expect(status).toBe(404)
})