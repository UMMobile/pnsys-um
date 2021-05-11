import { UserNotification } from '.'

let userNotifications

describe('view', () => {

  beforeEach(async () => {
    userNotifications = await UserNotification.create({
      _id: "1170938",
      notifications: [
        {
          _id: "1adc99d6-7f73-48bf-b3d8-49491f684986"
        }
      ],
    })
  })

  test('returns simple view', () => {
    const view = userNotifications.view()
    expect(typeof view).toBe('object')
    expect(view._id).toBe(userNotifications._id)
    expect(Array.isArray(view.notifications)).toBe(true)
  })

  test('returns full view', () => {
    const view = userNotifications.view(true)
    expect(typeof view).toBe('object')
    expect(view._id).toBe(userNotifications._id)
    expect(Array.isArray(view.notifications)).toBe(true)
    expect(view.notifications[0]?.id).toBe("1adc99d6-7f73-48bf-b3d8-49491f684986")
  })

  test('return list of notifications', () => {
    const notifications = userNotifications.getNotificationsList()
    expect(Array.isArray(notifications)).toBe(true)
    expect(notifications.length).toBe(1)
    expect(notifications[0]?.content?._id).toBe("1adc99d6-7f73-48bf-b3d8-49491f684986")
  })

  test('return single notification', () => {
    const notification = userNotifications.getNotificationById("1adc99d6-7f73-48bf-b3d8-49491f684986")
    expect(typeof notification).toBe('object')
    expect(notification.content?._id).toBe("1adc99d6-7f73-48bf-b3d8-49491f684986")
  })

  test('should search even deleted notifications', () => {
    const date = new Date()
    userNotifications.notifications[0].deleted = date
    const notification = userNotifications.getNotificationById("1adc99d6-7f73-48bf-b3d8-49491f684986", { ignoreDeleted: false })
    expect(typeof notification).toBe("object")
    expect(notification.content._id).toBe("1adc99d6-7f73-48bf-b3d8-49491f684986")
    expect(notification.deleted).toBe(date)
  })

  test('should ignore deleted notifications', () => {
    userNotifications.notifications[0].deleted = new Date()
    const notification = userNotifications.getNotificationById("1adc99d6-7f73-48bf-b3d8-49491f684986")
    expect(notification).toBeUndefined()
  })
})
