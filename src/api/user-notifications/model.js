import mongoose, { Schema } from 'mongoose'

const notificationSchema = new Schema({
  _id: {
    type: String,
    required: true,
    ref: 'Notification',
  },
  deleted: {
    type: Date,
    required: false,
  },
  seen: {
    type: Date,
    required: false,
  },
}, {
  _id: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

const userNotificationSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  notifications: [notificationSchema]
})

userNotificationSchema.methods = {
  view (full) {
    const view = {
      // simple view
      _id: this.id,
      notifications: this.notifications,
    }

    if(!full) return view

    const full_notifications = []
    for(const notification of view.notifications) {
      if(typeof notification._id === 'object')
        full_notifications.push(notification._id)
      else
        full_notifications.push(notification)
    }
    return {
      ...view,
      notifications: [...full_notifications]
    }
  },
  getNotificationsList: function(options = { ignoreDeleted: true }) {
    const full_notifications = []
    for(const notification of this.notifications) {
      if(notification._id) {
        const userNotification = {}
        if(notification.seen) userNotification.seen = notification.seen
        if(options.ignoreDeleted && !notification.deleted) {
          full_notifications.push({content: typeof notification._id === 'object' ? notification._id : notification, ...userNotification})
        } else if (!options.ignoreDeleted) {
          if(notification.deleted) userNotification.deleted = notification.deleted
          full_notifications.push({content: typeof notification._id === 'object' ? notification._id : notification, ...userNotification});
        }
      } else if(typeof notification._id === 'string') {

      }
    }

    return full_notifications
  },
  getNotificationById: function(id, options = { ignoreDeleted: true }) {
    return this.getNotificationsList(options).filter(notification => notification.content._id === id)[0]
  }
}

const model = mongoose.model('UserNotification', userNotificationSchema)

export const schema = model.schema
export default model
