interface ExportStatus {
  status: 'processing' | 'fetching_matter' | 'fetching_relationships' | 'fetching_contacts' | 'generating_csv' | 'completed' | 'error'
  matterId: string
  userId: string
  progress?: number
  message?: string
  csvData?: string
  filename?: string
  error?: string
  createdAt: number
  updatedAt: number
}

export default defineEventHandler(async (event) => {
  // Ensure user is authenticated
  if (!event.context.auth) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  const exportId = getRouterParam(event, 'exportId')
  
  if (!exportId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Export ID is required'
    })
  }

  // Get status from KV storage
  const statusData = await hubKV().getItem(`export:${exportId}`)
  
  if (!statusData) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Export not found or expired'
    })
  }

  // Handle both string and object responses from KV
  let status: ExportStatus
  if (typeof statusData === 'string') {
    status = JSON.parse(statusData)
  } else {
    status = statusData as ExportStatus
  }
  
  // Ensure user can only access their own exports
  if (status.userId !== event.context.auth.userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied'
    })
  }

  // Return status without sensitive data (csvData)
  return {
    status: status.status,
    progress: status.progress || 0,
    message: status.message || '',
    filename: status.filename,
    error: status.error,
    createdAt: status.createdAt,
    updatedAt: status.updatedAt
  }
})