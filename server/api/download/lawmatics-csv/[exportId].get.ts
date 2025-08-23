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
  // Check for auth token in query parameters (for download links)
  const query = getQuery(event)
  const authToken = query.auth as string
  
  // If auth token provided in query, validate it
  if (authToken && !event.context.auth) {
    try {
      // Validate Firebase ID token
      const response = await fetch(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${process.env.FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: authToken
        })
      })

      if (response.ok) {
        const data = await response.json()
        const user = data.users?.[0]
        
        if (user && user.email?.endsWith('@ohlawcolorado.com')) {
          event.context.auth = {
            userId: user.localId,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified
          }
        }
      }
    } catch (error) {
      console.error('Query auth token validation failed:', error)
    }
  }

  // Ensure user is authenticated (either via middleware or query parameter)
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

  // Check if export is completed
  if (status.status !== 'completed' || !status.csvData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Export not completed or data not available'
    })
  }

  // Set headers for CSV download
  setHeader(event, 'Content-Type', 'text/csv')
  setHeader(event, 'Content-Disposition', `attachment; filename="${status.filename || 'export.csv'}"`)
  setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
  setHeader(event, 'Pragma', 'no-cache')
  setHeader(event, 'Expires', '0')

  // Clean up the export data after download (fire and forget)
  setTimeout(async () => {
    try {
      await hubKV().removeItem(`export:${exportId}`)
    } catch (error) {
      console.error('Error cleaning up export:', error)
    }
  }, 1000)

  return status.csvData
})