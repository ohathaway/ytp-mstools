// server/api/auth/sessions.post.ts
import { pick } from 'lodash-es'
import { createId } from '@paralleldrive/cuid2'

export default defineEventHandler(async (event) => {
  try {
    const { id, email, name, avatar, providerId } = await readBody(event)
    const db = useDrizzle()
    const kv = useKV()
    
    // Create or update user
    const user = await db.insert(tables.users)
      .values({
        id,
        email,
        name,
        avatar,
        providerId,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: tables.users.id,
        set: {
          email,
          name,
          avatar,
          providerId,
          updatedAt: new Date()
        }
      })
      .returning()
      .get()

    // Create session
    const sessionId = createId()
    const session = {
      id: sessionId,
      userId: id,
      createdAt: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 1 week
    }

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
      user: pick(user, ['id', 'email', 'name', 'avatar', 'isAdmin'])
    }
  } catch (error) {
    console.error('Session creation error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create session'
    })
  }
})