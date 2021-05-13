import { success, notFound, invalidApp, error, providerError } from '../../services/response/'
import { UserNotification } from '.'
import { getPushClient } from '../../services/pushnotifications'

export const show = ({ params }, res, next) =>
  UserNotification.findById({_id: params.id})
    .populate('notifications._id', ['message', 'sender', 'createdAt', 'updatedAt'])
    .then(notFound(res))
    .then((notifications) => notifications ? notifications.getNotificationsList() : null)
    .then(success(res))
    .catch(next)

export const showSingle = ({ params }, res, next) =>
  UserNotification.findById(params.id)
    .populate('notifications._id', ['message', 'sender', 'createdAt', 'updatedAt'])
    .then(notFound(res))
    .then((notifications) => notifications ? notifications.getNotificationById(params.notificationId) : null)
    .then(success(res))
    .then(notFound(res))
    .catch(next)

export const showDevices = ({ params }, res, next) =>
  invalidApp(res, getPushClient())
    .then(async (client) => await client.viewDevices())
    .then(providerError(res))
    .then((res) => res.players.filter(player => player.external_user_id === params.id))
    .then((devices) => devices.length > 0 ? devices : null)
    .then(success(res, 200))
    .then(notFound(res))
    .catch(next)

export const update = ({ params, bodymen: { body: { deleted, seen } } }, res, next) =>
  UserNotification.findOneAndUpdate({
    _id: params.id,
    'notifications._id': params.notificationId,
  }, {
    '$set': {
      'notifications.$.deleted': deleted,
      'notifications.$.seen': seen,
    }
  }, { new: true, omitUndefined: true })
    .populate('notifications._id', ['message', 'sender', 'createdAt', 'updatedAt'])
    .then(notFound(res))
    .then((notifications) => notifications ? notifications.getNotificationById(params.notificationId, { ignoreDeleted: false }) : null)
    .then(success(res))
    .then(notFound(res))
    .catch(next)

