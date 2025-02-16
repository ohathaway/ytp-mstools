// server/api/lawmatics/[...].ts
import { type H3Event } from 'h3'
import { Buffer } from 'node:buffer'
import type { LawmaticsResponse, LawmaticsError } from '../types/lawmatics'

/*
const checkAuthorization = (authHeader: string | null, basicAuth: string): boolean => {
  if (!authHeader) return false
  
  try {
    return authHeader === `Basic ${basicAuth}` ||
      Buffer.from(
        authHeader.replace(/^Basic /, ''), 'base64')
          .toString('utf8')
          .split(':')[1] === basicAuth
  } catch (error) {
    console.error('error authenticating request: ', error)
    return false
  }
}
*/

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()
  const BASIC_AUTH = config.basicAuth
  const LM_KEY = config.lawmaticsToken
  const LM_HOST = config.lawmaticsUrl

  try {
    // Handle Auth
    /*
    const authHeader = getHeader(event, 'Authorization')
    if (!checkAuthorization(authHeader, BASIC_AUTH)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authorized'
      })
    }
    */

    // Get current URL and transform it
    const rawUrl = getRequestURL(event)
    console.info('rawUrl: ', rawUrl)
    const lmUrl = new URL(LM_HOST)
    console.info('lmUrl: ', lmUrl)
    lmUrl.pathname = `/v1/${rawUrl.pathname.split('/').slice(3).join('/')}`
    console.info('pathname: ', lmUrl.pathname)
    lmUrl.search = rawUrl.search
    console.info('search: ', lmUrl.search)

    console.info('Proxying request to:', lmUrl.toString())

    // Make request to Lawmatics
    const response = await $fetch<LawmaticsResponse | LawmaticsError>(lmUrl.toString(), {
      headers: { 
        Authorization: `Bearer ${LM_KEY}`
      }
    })

    // Handle 404 to 204 conversion for specific case
    if ('errors' in response && 
        response.errors[0]?.title === 'Matter Not Found') {
      return null // Nuxt will automatically send 204
    }

    return 'data' in response ? response.data : response
  } catch (error) {
    console.error('Error processing request:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error processing request'
    })
  }
})