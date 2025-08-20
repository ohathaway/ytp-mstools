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

    // Return status without csvData for security
    const { csvData, ...publicStatus } = status
    
    return {
      ...publicStatus,
      hasData: !!csvData
    }
  } catch (error) {
    console.error('Status check failed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Status check failed'
    })
  }
})