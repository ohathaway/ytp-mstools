// server/__/auth/[...].ts
export default defineEventHandler(async event => {
  try {
    const { firebase } = useRuntimeConfig(event).public
    // console.info('__/auth/ event: ', event)
    return event.$fetch(`https://${firebase.authDomain}${event.path}`)
  } catch (error) {
    console.error('Firebase proxy attempt failed: ', error)
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})