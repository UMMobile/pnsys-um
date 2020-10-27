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
