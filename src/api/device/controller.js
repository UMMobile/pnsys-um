import { getPushClient } from "../../services/pushnotifications"
import { invalidApp, providerError, success } from "../../services/response"

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  invalidApp(res, getPushClient())
    .then(async (client) => await client.viewDevices())
    .then(providerError(res))
    .then(success(res, 200))
    .catch(next)

export const show = ({ params: { id } }, res, next) =>
  invalidApp(res, getPushClient())
    .then(async (client) => await client.viewDevice(id))
    .then(providerError(res))
    .then(success(res, 200))
    .catch(next)

export const validExternals = (_, res, next) =>
  invalidApp(res, getPushClient())
    .then(async (client) => await client.viewDevices())
    .then(providerError(res))
    .then((res) => [...new Set(res.players.map(player => player.external_user_id))].filter(externalId => externalId))
    .then(success(res, 200))
    .catch(next)