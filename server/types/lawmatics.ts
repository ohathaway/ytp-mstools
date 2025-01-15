// server/types/lawmatics.ts
export interface LawmaticsResponse {
  data: any[]
  meta?: {
    total_pages: number
    limit_per_page: number
    total_entries: number
  }
  links?: {
    self: string
  }
}

export interface LawmaticsError {
  errors: Array<{
    title: string
    detail?: string
    status?: string
  }>
}