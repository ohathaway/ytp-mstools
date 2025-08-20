interface ExportStatus {
  status: 'processing' | 'fetching_matter' | 'fetching_relationships' | 'fetching_contacts' | 'generating_csv' | 'completed' | 'error'
  matterId: string
  exportId: string
  csvData?: string
  filename?: string
  error?: string
  progress?: {
    current: number
    total: number
    message: string
  }
  createdAt: number
}

export default defineEventHandler(async (event) => {
  try {
    const exportId = getRouterParam(event, 'exportId')
    
    if (!exportId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Export ID is required'
      })
    }

    // Get status from KV store
    const status = await hubKV().get<ExportStatus>(`export:${exportId}`)
    
    if (!status) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Export not found or expired'
      })
    }

    if (status.status !== 'completed') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Export not ready for download'
      })
    }

    if (!status.csvData || !status.filename) {
      throw createError({
        statusCode: 500,
        statusMessage: 'CSV data not available'
      })
    }

    // Set headers for CSV download
    setHeader(event, 'Content-Type', 'text/csv')
    setHeader(event, 'Content-Disposition', `attachment; filename="${status.filename}"`)
    setHeader(event, 'Cache-Control', 'no-cache')

    // Optional: Clean up the KV entry after download
    // We'll keep it for now in case user wants to download again
    // await hubKV().del(`export:${exportId}`)

    return status.csvData
  } catch (error) {
    console.error('CSV download failed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Download failed'
    })
  }
})