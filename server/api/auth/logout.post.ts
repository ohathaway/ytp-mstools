// server/api/auth/logout.post.ts
export default defineEventHandler(async (event) => {
  try {
    // With token-based authentication, logout is handled client-side
    // This endpoint can be used for logging/auditing purposes if needed
    
    const auth = event.context.auth
    if (auth?.email) {
      console.log(`User logged out: ${auth.email}`)
    }

    return { 
      success: true,
      message: 'Logout successful - token invalidated on client'
    }
  } catch (error) {
    console.error('Logout error:', error)
    return { 
      success: true,
      message: 'Logout processed'
    }
  }
})