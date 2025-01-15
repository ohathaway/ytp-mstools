// server/api/auth/sessions.post.ts
import { createId } from '@paralleldrive/cuid2'

export default defineEventHandler(async (event) => {
  try {
    const { email, displayName } = await readBody(event)
    
    // Validate email domain
    if (!email.endsWith('@ohlawcolorado.com')) {
      throw createError({
        statusCode: 403,
        message: 'Invalid email domain. Must be @ohlawcolorado.com'
      })
    }

    const sessionId = createId()
    const session: UserSession = {
      id: sessionId,
      email,
      displayName,
      createdAt: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 1 week
    }

    // Store session in KV store
    const kv = hubKV()
    await kv.set(
      `session:${sessionId}`,
      JSON.stringify(session),
      { expirationTtl: 60 * 60 * 24 * 7 } // 1 week
    )

    // Set session cookie
    setCookie(event, 'session', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    })

    return {
      success: true,
      user: {
        email: session.email,
        displayName: session.displayName
      }
    }
  } catch (error) {
    console.error('Session creation error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create session'
    })
  }
})