// server/api/auth/validate.get.ts
export default defineEventHandler(async (event) => {
  try {
    const sessionId = getCookie(event, 'session')
    if (!sessionId) {
      return {
        statusCode: 401,
        message: 'No session found'
      }
    }

    const kv = hubKV()
    const sessionData = await kv.get(`session:${sessionId}`)
    
    if (!sessionData) {
      return {
        statusCode: 401,
        message: 'Invalid session'
      }
    }

    const session: UserSession = JSON.parse(sessionData as string)

    if (session.expiresAt < Date.now()) {
      await kv.del(`session:${sessionId}`)
      return {
        statusCode: 401,
        message: 'Session expired'
      }
    }

    // Additional domain validation
    if (!session.email.endsWith('@ohlawcolorado.com')) {
      await kv.delete(`session:${sessionId}`)
      return {
        statusCode: 403,
        message: 'Invalid email domain'
      }
    }

    return {
      user: {
        email: session.email,
        displayName: session.displayName
      }
    }
  } catch (error) {
    console.error('Session validation error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to validate session'
    })
  }
})