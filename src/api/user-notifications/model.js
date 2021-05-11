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
      full_notifications.push(notification._id)
    }
    return {
      ...view,
      notifications: [...full_notifications]
    }
  },
  getNotificationsList: function() {
    const full_notifications = []
    for(const notification of this.notifications) {
      if(notification._id) {
        const userNotification = {}
        if(notification.seen) userNotification.seen = true
        if(notification.deleted) userNotification.deleted = true
        full_notifications.push({content: notification._id, ...userNotification})
      }
    }

    return full_notifications
  },
  getNotificationById: function(id) {
    return this.getNotificationsList().filter(notification => notification.content._id === id)[0]
  }
}

const model = mongoose.model('UserNotification', userNotificationSchema)

export const schema = model.schema
export default model
