import { success, notFound, invalidApp, error, providerError } from '../../services/response/'
import { getPushClient } from "../../services/pushnotifications";
import { Notification } from '.'

export const create = ({ bodymen: { body: { message, options } } }, res, next) =>
  invalidApp(res, getPushClient())
    .then(async (client) => {
      try {
        const response = await client.sendNotification(message, options)
        return response
      } catch (error) {
        if (error.name === 'ValidationError')
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
        else if (error.response)
          return error.response
      }
    })
    .then(providerError(res))
    .then((res_notification) => res_notification ? Notification.create({
      _id: Notification.extractId(res_notification),
      message,
      options,
      response: res_notification,
      analytics: {
        clicked: [],
        received: [],
      }
    }) : null)
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
