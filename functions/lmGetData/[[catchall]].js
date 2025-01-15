// functions/lmGetData/[[catchall]].js
import { Buffer } from 'node:buffer'

export const onRequestGet = async context => { 
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
    const authHeader = context.request.headers.get("Authorization")
    // console.debug('authHeader: ', JSON.stringify(authHeader, null, 2))
    if (!checkAuthorization(authHeader)) {
      return new Response('', {
        status: 401,
        statusText: 'Not authorized'
      })
    } 

    console.info('received event: ', JSON.stringify(context.request.url, null, 2))
    const lmUrl = new URL(context.request.url)
    const lmHost = new URL(LM_HOST)
    lmUrl.host = lmHost.host
    lmUrl.protocol = 'https'
    lmUrl.port = ''
    lmUrl.pathname = `/v1/${lmUrl.pathname.split('/').slice(2).join('/')}`
    console.info('lmUrl: ', lmUrl)

    const response = await fetch(lmUrl.toString(), {
      headers: { Authorization: `Bearer ${LM_KEY}` }
    })
    const result = await response.json()
    console.info('lm API result count: ', result.data.length)
    return new Response(JSON.stringify(result.data), {
      status: response.status
    })
  } catch (error) {
    console.error('Error details:', error)
    console.error('Error response:', error.response)
    console.error('Error request:', error.request)
    const message = 'error processing submission'
    console.error(`${message}: ${JSON.stringify(error, null, 2)}`)
    return new Response(`${message}: ${JSON.stringify(error, null, 2)}`, {
      status: 500
    })
  }
}