import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes from '.'
import { Notification } from '../notification'

const app = () => express(apiRoot, routes)

beforeEach(async () => {
  await Notification.create({
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
          type: "external",
          value: [
            "1130745"
          ]
        }
      }
    },
    response: {
      id: "1adc99d6-7f73-48bf-b3d8-49491f684986",
      recipients: 1,
      external_id: null
    },
    analytics: {
      clicked: [ "1130795" ]
    }
  })
})

test('POST:received /analytics 200', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({
      notificationId: "1adc99d6-7f73-48bf-b3d8-49491f684986",
      event: "received",
      userId: "1130745"
    })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(body).toContain("1130745")

  const { status: status_clicked, body: body_clicked } = await request(app())
    .post(`${apiRoot}`)
    .send({
      notificationId: "1adc99d6-7f73-48bf-b3d8-49491f684986",
      event: "clicked",
      userId: "1130745"
    })
  expect(status_clicked).toBe(200)
  expect(Array.isArray(body_clicked)).toBe(true)
  expect(body_clicked).toContain("1130745")
})

test('POST:clicked /analytics 200', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({
      notificationId: "1adc99d6-7f73-48bf-b3d8-49491f684986",
      event: "clicked",
      userId: "1130745"
    })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(body).toContain("1130745")
})

test('POST /analytics 400', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send()
  expect(status).toBe(400)
})

test('POST /analytics 400', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({
      notificationId: "1adc99d6-7f73-48bf-b3d8-49491f684986",
      event: "somethingwrong",
      userId: "1130745"
    })
  expect(status).toBe(400)
})

test('POST /analytics 404', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({
      notificationId: "wrong-notification-id",
      event: "clicked",
      userId: "1130745"
    })
  expect(status).toBe(404)
})

test('GET /analytics 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query()
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(body[0].analytics.clicked).toContain("1130795")
})

test('GET /analytics/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/1adc99d6-7f73-48bf-b3d8-49491f684986`)
    .query()
  expect(status).toBe(200)
  expect(body.analytics.clicked).toContain("1130795")
})

test('GET /analytics/:id 404', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/wrong-notification-id`)
    .query()
  expect(status).toBe(404)
})