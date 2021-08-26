import { success, notFound, invalidApp, error, providerError } from '../../services/response/'
import { getPushClient } from "../../services/pushnotifications";
import { Notification } from '.'
import { UserNotification } from '../user-notifications'

export const create = ({ bodymen: { body: { message, options, sender } } }, res, next) =>
  invalidApp(res, getPushClient())
    .then(async (client) => {
      try {
        const push_message = {
          heading: message.push_heading ?? message.heading,
          content: message.push_content ?? message.content,
        };
        const response = await client.sendNotification(push_message, options)
        return response
      } catch (error) {
        if (error.name === 'ValidationError') {
          return {
            body: {
              errors: [
                ...error.details?.map((detail) => {
                  if (typeof detail.message === 'string')
                    return detail.message?.replace(/\"/g, "'")
                  else
                    return detail.message
                })
              ]
            }
          }
        } else if (error.response) {
          return error.response
        }
      }
    })
    .then(providerError(res))
    .then((res_notification) => res_notification ? Notification.create({
      _id: Notification.extractId(res_notification),
      message: {
        push_heading: message.push_heading ?? message.heading,
        push_content: message.push_content ?? message.content,
        heading: message.heading ?? message.push_heading,
        content: message.content ?? message.push_content,
      },
      options,
      sender,
      response: res_notification,
      analytics: {
        clicked: [],
        received: [],
      }
    }) : null)
    .then(async (notification) => { // Add single notification for every user
      if(notification && notification.options?.targets?.to?.type === 'externals') {
        for(const userId of notification.options?.targets?.to?.value) {
          await UserNotification.findOneAndUpdate({ _id: userId }, {
            $addToSet: { 'notifications': { _id: notification._id } }
          }, { upsert: true })
        }
      }
      return notification
    })
    .then((notification) => notification ? notification.view(true) : null)
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Notification.find(query, select, cursor)
    .then((notifications) => notifications.map((notification) => notification.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Notification.findById(params.id)
    .then(notFound(res))
    .then((notification) => notification ? notification.view() : null)
    .then(success(res))
    .catch(next)

export const cancel = ({ params }, res, next) =>
  Notification.findById(params.id)
    .then(notFound(res))
    .then((found) => found ? invalidApp(res, getPushClient()) : null)
    .then((client) => client ? client.cancelNotification(params.id) : null)
    .then((r) => r ? r.body.success ? Notification.findByIdAndUpdate(params.id, { canceled: true }) : null : null)
    .then(success(res, 204))
    .catch(next)
