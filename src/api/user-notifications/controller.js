import { success, notFound, invalidApp, error, providerError } from '../../services/response/'
import { UserNotification } from '.'

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

