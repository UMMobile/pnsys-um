import OneSignal from '@jonathangomz/onesignal-client'
import * as response from '.'
import { getPushClient } from '../pushnotifications'

let res

beforeEach(() => {
  res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
    end: jest.fn(() => res)
  }
})

describe('success', () => {
  it('responds with passed object and status 200', () => {
    expect(response.success(res)({ prop: 'value' })).toBeNull()
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith({ prop: 'value' })
  })

  it('responds with passed object and status 201', () => {
    expect(response.success(res, 201)({ prop: 'value' })).toBeNull()
    expect(res.status).toBeCalledWith(201)
    expect(res.json).toBeCalledWith({ prop: 'value' })
  })

  it('does not send any response when object has not been passed', () => {
    expect(response.success(res, 201)()).toBeNull()
    expect(res.status).not.toBeCalled()
  })
})

describe('notFound', () => {
  it('responds with status 404 when object has not been passed', () => {
    expect(response.notFound(res)()).toBeNull()
    expect(res.status).toBeCalledWith(404)
    expect(res.end).toHaveBeenCalledTimes(1)
  })

  it('returns the passed object and does not send any response', () => {
    expect(response.notFound(res)({ prop: 'value' })).toEqual({ prop: 'value' })
    expect(res.status).not.toBeCalled()
    expect(res.end).not.toBeCalled()
  })
})

describe('invalidApp', () => {
  it('returns the app when app is valid', async () => {
    const validApp = getPushClient();
    expect(await response.invalidApp(res, validApp)).toEqual(validApp)
    expect(res.status).not.toBeCalled()
  })

  it('responds with status 400 when app is not valid', async () => {
    const invalidApp = new OneSignal({
      appId: "0149df36-502c-445a-9626-0bf54d8ea7ba",
      authKey: "asasdfasdfasfdasfasfasdfasdf",
      restApiKey: "asdfdasfasdfasdfasdfasdfadsf"
    });
    expect(await response.invalidApp(res, invalidApp)).toBeNull()
    expect(res.status).toBeCalledWith(400)
    expect(res.json).toBeCalledTimes(1)
  })
})

describe('providerError', () => {
  it('returns the body when response is valid', async () => {
    const res_provider = {
      status: 200,
      body: {
        id: "b98881cc-1e94-4366-bbd9-db8f3429292b",
        recipients: 1,
        external_id: null
      }
    }
    expect(await response.providerError(res)(res_provider)).toEqual(res_provider.body)
    expect(res.status).not.toBeCalled()
  })

  it('responds with status 500 when get error from provider', async () => {
    const res_provider = {
      status: 400,
      body: {
        errors: [
            "Message Notifications must have English language content"
        ]
      }
    }
    expect(await response.providerError(res)(res_provider)).toBeNull()
    expect(res.status).toBeCalledWith(500)
    expect(res.json).toBeCalledTimes(1)
  })

  it('responds with status 500 when get error from provider', async () => {
    const res_provider = {
      status: 200,
      body: {
        id: "c0bf597f-08e9-4e0a-8cc5-0de94ffa6033",
        recipients: 1,
        external_id: null,
        errors: {
            invalid_player_ids: [
                "b186912c-cf25-4688-8218-06cb13e09a4f"
            ]
        }
      }
    }
    expect(await response.providerError(res)(res_provider)).toBeNull()
    expect(res.status).toBeCalledWith(500)
    expect(res.json).toBeCalledTimes(1)
  })
})