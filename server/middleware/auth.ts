// server/middleware/auth.ts
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  // Skip auth check for public routes and auth endpoints
  if (
    event.path.startsWith('/api/auth') ||
    event.path.startsWith('/api/_hub') ||
    event.path.startsWith('/api/download') ||  // Skip download routes - they handle auth internally
    !event.path.startsWith('/api')
  ) {
    return
  }

  try {
    const authHeader = getHeader(event, 'authorization')
    
    // Check for Basic auth (for development/testing)
    if (authHeader?.startsWith('Basic ')) {
      const token = authHeader.split(' ')[1]
      
      if (process.env.BASIC_AUTH && token === process.env.BASIC_AUTH) {
        event.context.auth = {
          userId: 'basic-auth',
          email: 'basic-auth@ohlawcolorado.com',
          isAdmin: true
        }
        return
      }
    }

    // Check for Firebase ID token
    if (authHeader?.startsWith('Bearer ')) {
      const idToken = authHeader.split(' ')[1]
      
      try {
        // Validate Firebase ID token by calling Firebase REST API
        const response = await fetch(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${process.env.FIREBASE_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: idToken
          })
        })

        if (!response.ok) {
          throw new Error('Token validation failed')
        }

        const data = await response.json()
        const user = data.users?.[0]
        
        if (!user) {
          throw new Error('No user found in token')
        }

        // Validate email domain
        if (!user.email?.endsWith('@ohlawcolorado.com')) {
          throw createError({
            statusCode: 403,
            message: 'Invalid email domain'
          })
        }

        // Store user data in context for route handlers
        event.context.auth = {
          userId: user.localId,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified
        }
        return

      } catch (error) {
        console.error('Firebase token validation error:', error)
        throw createError({
          statusCode: 401,
          message: 'Invalid authentication token'
        })
      }
    }

    // No valid authentication found
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })

  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('Authentication middleware error:', error)
    throw createError({
      statusCode: 401,
      message: 'Authentication failed'
    })
  }
})
