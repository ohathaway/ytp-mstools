// server/middleware/auth.ts
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  // Skip auth check for public routes and auth endpoints
  if (
    event.path.startsWith('/api/auth') ||
    event.path.startsWith('/api/_hub') ||
    !event.path.startsWith('/api')
  ) {
    // console.debug('public route requested')
    return
  }

  try {
    // console.debug('private route requested')
    // First check for bearer token
    // console.debug('first checking for basic auth...')
    const authHeader = getHeader(event, 'authorization')
    if (authHeader?.startsWith('Basic ')) {
      const token = authHeader.split(' ')[1]
      
      // For development/testing - check if token matches env variable
      if (process.env.BASIC_AUTH && token === process.env.BASIC_AUTH) {
        console.debug('valid token found')
        // Set a default session context for API token auth
        event.context.session = {
          userId: 'basic-auth',
          isAdmin: true
        }
        return
      }
    }

    // Fall back to session cookie
    console.debug('no bearer token found')
    console.debug('checking for authorized session...')
    const session = getCookie(event, 'session')
    
    if (!session) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    // Quick session check in KV
    const kv = event.context.cloudflare.env.KV
    const sessionData = await kv.get(`session:${session}`)

    if (!sessionData) {
      throw createError({
        statusCode: 401,
        message: 'Invalid session'
      })
    }

    // Store session data in context for route handlers
    event.context.session = JSON.parse(sessionData)
  } catch (error) {
    console.error('error checking authorization: ', error)
    throw createError({
      statusCode: 401,
      message: 'Authentication failed'
    })
  }
})
