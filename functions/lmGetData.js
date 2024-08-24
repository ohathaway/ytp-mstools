export const onRequestGet = context => { 
  /*
    setup constants
  */
  const BASIC_AUTH = context.env.BASIC_AUTH
  const LM_KEY = context.env.LAWMATICS_TOKEN
  const LM_HOST = context.env.LAWMATICS_URL

/*
  LEGACY - need to implement rewriting the 404 with a 204 empty
    LM_API.interceptors.response.use(
      // return 2xx raw and unmodified
      response => { 
        return response
      },
      error => {
        if (error.response && error.response.status === 404 && error.response.data.errors[0].title === 'Matter Not Found') {
          error.response.status = 204
          error.response.statusText = 'No Content'
          return Promise.resolve(error.response)
        }
        return Promise.reject(error);
      }
    )
*/

  // function definitions

  const checkAuthorization = authHeader => {
    try {
      return authHeader === `Basic ${BASIC_AUTH}` ||
        Buffer.from(
          authHeader.replace(/^Basic /, ''), 'base64')
            .toString('utf8')
            .split(':')[1] === BASIC_AUTH
    } catch (error) {
      console.error('error authenticating request: ', error)
      return false
    }
  }

  // main entrypoint
  try {
    // handle Auth
    if (!checkAuthorization(context.request.headers.authorization)) {
      return new Response('', {
        status: 401,
        statusText: 'Not authorized'
      })
    } 

    console.info('received event: ', JSON.stringify(context.request.url, null, 2))
    const lmUrl = context.request.url.split('/').slice(1).join('/')
    console.info('lmUrl: ', lmUrl)

    const result = await fetch(lmUrl, {
      headers: { Authorization: `Bearer ${LM_KEY}` },
    })

    return new Response(result.body, {
      status: result.status
    })
  } catch (error) {
    console.error('Error details:', error)
    console.error('Error response:', error.response)
    console.error('Error request:', error.request)
    const message = 'error processing submission'
    console.error(`${message}: ${JSON.stringify(error, null, 2)}`)
    res.status(500).send(`${message}: ${JSON.stringify(error, null, 2)}`)
    throw error
  }
}