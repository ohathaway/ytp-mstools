// server/api/auth/logout.post.ts
export default defineEventHandler(async (event) => {
  try {
    const sessionId = getCookie(event, 'session')
    if (sessionId) {
      const kv = hubKV()
      await kv.del(`session:${sessionId}`)
    }

    deleteCookie(event, 'session', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/'
    })

    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to logout'
    })
  }
})