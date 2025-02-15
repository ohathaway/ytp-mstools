// types/ndc.ts
export type ReportType = 'ATTORNEY_PAYEE' | 'DEBTOR_PAYMENT' | 'PORTFOLIO_AGING'

export interface NDCReport {
  id: string
  reportType: ReportType
  reportMonth: string
  reportYear: string
  reportWeek?: number
  filename: string
  storagePath: string
  fileSize: number
  contentHash: string
  version: number
  isCurrentVersion: boolean
  previousVersionId?: string
  executionDate?: Date
  emailSubject?: string
  uploadedAt: Date
  processedAt?: Date
  status: 'pending' | 'processing' | 'completed' | 'error'
  error?: string
}

export interface ProcessingResult {
  reportId: string
  processedRows: number
  status: 'success' | 'error'
  error?: string
}