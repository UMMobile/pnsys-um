import { Notification } from '.'

let notification

describe('view', () => {

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
            type: "external",
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

  test('returns simple view', () => {
    const view = notification.view()
    expect(typeof view).toBe('object')
    expect(view._id).toBe(notification._id)
    expect(view.message.heading.en).toBe(notification.message.heading.en)
    expect(view.options.targets.to.type).toBe(notification.options.targets.to.type)
    expect(view.response).toBeUndefined()
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  test('returns full view', () => {
    const view = notification.view(true)
    expect(typeof view).toBe('object')
    expect(view._id).toBe(notification._id)
    expect(view.message.heading.en).toBe(notification.message.heading.en)
    expect(view.options.targets.to.type).toBe(notification.options.targets.to.type)
    expect(view.response).toBeTruthy()
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  test('return provider notification id (OneSignal)', () => {
    const id = Notification.extractId(notification.response)
    expect(typeof id).toBe('string')
    expect(id).toBe(notification._id)
  })

  test('return provider notification id (WonderPush)', () => {
    notification.response.notificationId = notification.response.id
    delete notification.response.id
    const notificationId = Notification.extractId(notification.response)
    expect(typeof notificationId).toBe('string')
    expect(notificationId).toBe(notification._id)
  })

  test('throws an error on no provider notification id on response', () => {
    delete notification.response.id
    try {
      Notification.extractId(notification.response)
    } catch (error) {
      expect(error.message).toBe('No id for document')
    }
  })
})
