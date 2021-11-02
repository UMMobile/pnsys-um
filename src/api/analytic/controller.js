import { notFound, success } from "../../services/response";
import { Notification } from "../notification";

export const create = ({ body: { notificationId, event, userId } }, res, next) =>
  Notification.findById(notificationId)
    .then(notFound(res))
    .then(async () => {
      if(event === 'clicked')
        return await (await Notification.findOneAndUpdate({ _id: notificationId }, {
          $addToSet: { 'analytics.clicked': userId }
        }, { new: true })).analytics.clicked
      else if(event === 'received')
        return await (await Notification.findOneAndUpdate({ _id: notificationId }, {
          $addToSet: { 'analytics.received': userId }
        }, { new: true })).analytics.received
    })
    .then(success(res, 200))
    .catch(next)

export const index = ({ querymen: { query, cursor }}, res, next) =>
  Notification.find({...query, analytics: { $exists: true }}, { analytics: 1 }, cursor)
    .then(notFound(res))
    .then((entity) => res.json(entity))
    .catch(next)

export const show = ({ params: { id } }, res, next) =>
  Notification.findById(id, { analytics: 1 })
    .then(notFound(res))
    .then(success(res, 200))
    .catch(next)

export const showDetails = ({ params: { id } }, res, next) =>
  Notification.findById(id, { analytics: 1, options: 1 })
    .then(notFound(res))
    .then((entity) => {
      const total_users = entity.options.targets.to.value;
      const clicked_users = entity.analytics.clicked;
      const received_users = entity.analytics.received;
      const compose = {
        analitycs: {
          total_users: total_users.length,
          clicked: {
            quantity: clicked_users.length,
            quantity_not: total_users.length - clicked_users.length,
            users: clicked_users,
            users_not: total_users.filter(el => !clicked_users.includes(el)),
          },
          received: {
            quantity: received_users.length,
            quantity_not: total_users.length - received_users.length,
            users: received_users,
            users_not: total_users.filter(el => !received_users.includes(el)),
          },
          users: total_users,
        }
      };
      return res.status(200).json(compose)
    })
    .catch(next)
