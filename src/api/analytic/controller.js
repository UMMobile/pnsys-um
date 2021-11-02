import { notFound, success, invalidApp } from "../../services/response";
import { getPushClient } from '../../services/pushnotifications'
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
    .then(async (entity) => {
      const client = await invalidApp(res, getPushClient())
      const devices = await client.viewDevices();
      const subscribedUsers = [...new Set(devices.body.players.map(player => player.external_user_id))].filter(externalId => externalId)

      const totalUsers = entity.options.targets.to.value.filter(el => subscribedUsers.includes(el));
      const clickedUsers = entity.analytics.clicked;
      const receivedUsers = entity.analytics.received;
      const compose = {
        analitycs: {
          total_users: totalUsers.length,
          clicked: {
            quantity: clickedUsers.length,
            quantity_not: totalUsers.length - clickedUsers.length,
            users: clickedUsers,
            users_not: totalUsers.filter(el => !clickedUsers.includes(el)),
          },
          received: {
            quantity: receivedUsers.length,
            quantity_not: totalUsers.length - receivedUsers.length,
            users: receivedUsers,
            users_not: totalUsers.filter(el => !receivedUsers.includes(el)),
          },
          users: totalUsers,
        }
      };
      return res.status(200).json(compose)
    })
    .catch(next)
