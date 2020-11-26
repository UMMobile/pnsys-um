export const success = (res, status) => (entity) => {
  if (entity) {
    res.status(status || 200).json(entity)
  }
  return null
}

export const notFound = (res) => (entity) => {
  if (entity) {
    return entity
  }
  res.status(404).end()
  return null
}

export const invalidApp = async (res, app) => {
  let isvalid
  try {
    isvalid = await app.isValid();
  } catch(err) { }

  if(isvalid) {
    return app
  } else {
    res.status(400).json({
      errors: [
        'Invalid app. Verify your keys or appId'
      ]
    })
    return null
  }
}

export const providerError = (res) => ({ status, error, body }) => {
  if(status !== 200 || error || body.errors) {
    res.status(500).json(body.errors || error)
    return null
  }
  return body
}