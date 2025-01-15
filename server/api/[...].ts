export default defineEventHandler(async (event: H3Event) => {
  console.error('Endpoint not found')
  throw createError({
    statusCode: 404,
    statusMessage: 'endpoint not found'
  })
})