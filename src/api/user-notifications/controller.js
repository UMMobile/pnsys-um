import { success, notFound, invalidApp, error, providerError } from '../../services/response/'
import { UserNotification } from '.'

export const show = ({ params }, res, next) =>
  UserNotification.findOne({_id: params.id})
  .populate('notifications._id', ['message', 'sender', 'createdAt', 'updatedAt'])
  .then(notFound(res))
  .then((notifications) => notifications ? notifications.getNotificationsList() : null)
  .then(success(res))
  .catch(next)