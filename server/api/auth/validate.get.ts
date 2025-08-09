// server/api/auth/validate.get.ts
export default defineEventHandler(async (event) => {
  try {
    // This endpoint now validates Firebase ID tokens via middleware
    // If we reach here, the token is valid and user data is in event.context.auth
    const auth = event.context.auth
    
    if (!auth) {
      return {
        valid: false,
        message: 'No authentication context'
      }
    }

    return {
      valid: true,
      user: {
        email: auth.email,
        displayName: auth.displayName,
        uid: auth.userId
      }
    }
  } catch (error) {
    console.error('Token validation error:', error)
    return {
      valid: false,
      message: 'Token validation failed'
    }
  }
})