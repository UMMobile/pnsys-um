import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import { Notification } from '../notification'
import routes, { UserNotification } from '.'

const app = () => express(apiRoot, routes)

let userNotifications, notification;
let userId = '1170938', notificationId = 'f1e3dc92-afcf-424b-9a21-c318263fda8e';

beforeEach(async () => {
  notification = await Notification.create({
    "_id": notificationId,
    "message": {
        "heading": {
            "en": "Test: extension service (closed)",
            "es": "Test: extension de servicio (closed)"
        },
        "content": {
            "en": "-",
            "es": "-"
        }
    },
    "options": {
        "targets": {
            "to": {
                "type": "externals",
                "value": [
                  userId,
                ]
            }
        }
    },
    "createdAt": "2021-05-13T14:53:21.865Z",
    "updatedAt": "2021-05-13T14:53:21.865Z",
    "response": {
        "id": notificationId,
        "recipients": 3,
        "external_id": null
    },
    "analytics": {
        "clicked": [],
        "received": []
    },
    "sender": "tester"
  })

  userNotifications = await UserNotification.create({
    _id: userId,
    notifications: [
      {
        _id: notificationId
      }
    ],
  })
})

test('GET /user/:id/notifications 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${userId}/notifications`)
    .query()

  expect(status).toBe(200)
  expect(Array.isArray(body)).toBeTruthy()
  expect(typeof body[0]).toEqual('object')
  expect(body[0]).toHaveProperty('content')
  expect(body[0].content).toHaveProperty('message')
  expect(body[0].content.id).toEqual(notificationId)
})

test('GET /user/:id/notifications 404', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/1234567/notifications`)
    .query()
  expect(status).toBe(404)
})

test('GET /user/:id/notifications/:notificationId 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${userId}/notifications/${notificationId}`)
    .query()

  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body).toHaveProperty('content')
  expect(body.content).toHaveProperty('message')
  expect(body.content.id).toBe(notificationId)
})

test('GET /user/:id/notifications/:notificationId 404', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${userId}/notifications/123456789`)
    .query()

  expect(status).toBe(404)
})

test('GET /user/:id/devices 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${userId}/devices`)
    .query()

  expect(status).toBe(200)
  expect(Array.isArray(body)).toBeTruthy()
  if(body.length > 0)
    expect(body[0].external_user_id).toBe(userId)
})

test('GET /user/:id/devices 404', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/1234567/devices`)
    .query()

  expect(status).toBe(404)
})

test('PUT /user/:id/notifications/:notificationId 200', async () => {
  const now = new Date()
  const { status, body } = await request(app())
    .put(`${apiRoot}/${userId}/notifications/${notificationId}`)
    .send({
      "deleted": now,
      "seen": now
    })

  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.seen).toBe(now.toISOString())
  expect(body.deleted).toBe(now.toISOString())
})

test('PUT /user/:id/notifications/:notificationId 200', async () => {
  const now = new Date()
  const { status, body } = await request(app())
    .put(`${apiRoot}/${userId}/notifications/${notificationId}`)
    .send({
      "seen": now
    })

  expect(status).toBe(200)
  expect(body.seen).toBe(now.toISOString())
  expect(body.deleted).toBeUndefined()
})

test('PUT /user/:id/notifications/:notificationId 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${userId}/notifications/${notificationId}`)
    .send({
      "x": "this should be ignored"
    })

  expect(status).toBe(200)
  expect(body.seen).toBeUndefined()
  expect(body.deleted).toBeUndefined()
})

test('PUT /user/:id/notifications/:notificationId 200', async () => {
  const seenTime = new Date()
  const { body: bodyForSeen } = await request(app())
    .put(`${apiRoot}/${userId}/notifications/${notificationId}`)
    .send({
      "seen": seenTime
    })

  const deletedTime = new Date()
  const { body: bodyForDeleted } = await request(app())
    .put(`${apiRoot}/${userId}/notifications/${notificationId}`)
    .send({
      "deleted": deletedTime,
    })

  expect(bodyForSeen.seen).toBe(seenTime.toISOString())
  expect(bodyForDeleted.deleted).toBe(deletedTime.toISOString())
})

test('PUT /user/:id/notification/:notificationId 404', async () => {
  const now = new Date()
  const { status } = await request(app())
    .put(`${apiRoot}/${userId}/notifications/123456789`)
    .send({
      "deleted": now,
      "seen": now
    })

  expect(status).toBe(404)
})