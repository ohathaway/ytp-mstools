// server/api/lawmatics/[...].ts
import { type H3Event } from 'h3'
import type { LawmaticsResponse, LawmaticsError } from '../../types/lawmatics'

export default defineEventHandler(async (event: H3Event) => {
  // Ensure user is authenticated (set by auth middleware)
  if (!event.context.auth) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  const config = useRuntimeConfig()
  const LM_KEY = config.lawmaticsToken
  const LM_HOST = config.lawmaticsUrl

  try {
    // Get current URL and transform it
    const rawUrl = getRequestURL(event)
    const lmUrl = new URL(LM_HOST)
    lmUrl.pathname = `/v1/${rawUrl.pathname.split('/').slice(3).join('/')}`
    lmUrl.search = rawUrl.search

    // console.info('Proxying request to:', lmUrl.toString())

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