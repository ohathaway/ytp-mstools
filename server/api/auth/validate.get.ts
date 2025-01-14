// server/api/auth/validate.get.ts
import { pick } from 'lodash-es'

export default defineEventHandler(async (event) => {
  try {
    const sessionId = getCookie(event, 'session')
    if (!sessionId) {
      return {
        statusCode: 401,
        message: 'No session found'
      }
    }

    console.info('typeof useKV', typeof useKV)
    const kv = useKV()
    console.info('initialized KV')
    const session = await kv.get(`session:${sessionId}`)
    console.debug('')
    
    if (!session) {
      return {
        statusCode: 401,
        message: 'Invalid session'
      }
    }

    if (session.expiresAt < Date.now()) {
      await kv.delete(`session:${sessionId}`)
      return {
        statusCode: 401,
        message: 'Session expired'
      }
    }

    const db = useDrizzle()
    const user = await db.query.users.findFirst({
      where: eq(tables.users.id, session.userId)
    })

    if (!user) {
      return {
        statusCode: 401,
        message: 'User not found'
      }
    }

    return {
      user: pick(user, ['id', 'email', 'name', 'avatar', 'isAdmin'])
    }
  } catch (error) {
    console.error('Session validation error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to validate session'
    })
  }
})