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
  Notification.find({...query, analytics: { $exists: true }}, { analytics: 1, options: 1, sender: 1 }, cursor)
    .then(notFound(res))
    .then((entities) => {
      
      let compose = entities.map(entity => {
        const totalUsers = entity.options.targets.to.value;
        const clickedUsers = entity.analytics.clicked;
        const receivedUsers = entity.analytics.received;
        return {
          notification_id: entity.id,
          notification_content_url: `/notifications/${entity.id}`,
          analytics: {
            sender: entity.sender,
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
        }
      });

      compose = compose.filter(entity => entity)
      return res.status(200).json(compose)
    })
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
      const totalUsers = entity.options.targets.to.value;
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
