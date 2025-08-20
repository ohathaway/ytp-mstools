// CSV Export Utility for Wealth Counsel contact data
export interface CsvExportOptions {
  filename?: string
  delimiter?: string
  includeHeaders?: boolean
}

export class CsvExporter {
  private delimiter: string
  private includeHeaders: boolean

  constructor(options: CsvExportOptions = {}) {
    this.delimiter = options.delimiter || ','
    this.includeHeaders = options.includeHeaders !== false
  }

  /**
   * Escapes a value for CSV format
   * - Wraps in quotes if contains delimiter, quotes, or newlines
   * - Escapes internal quotes by doubling them
   */
  private escapeValue(value: any): string {
    if (value === null || value === undefined) {
      return ''
    }

    const stringValue = String(value)
    
    // Check if value needs to be quoted
    const needsQuotes = stringValue.includes(this.delimiter) || 
                       stringValue.includes('"') || 
                       stringValue.includes('\n') || 
                       stringValue.includes('\r')

    if (needsQuotes) {
      // Escape internal quotes by doubling them
      const escapedValue = stringValue.replace(/"/g, '""')
      return `"${escapedValue}"`
    }

    return stringValue
  }

  /**
   * Converts an array of objects to CSV string
   */
  toCsv(data: Record<string, any>[], headers?: string[]): string {
    if (!data || data.length === 0) {
      return ''
    }

    const csvHeaders = headers || Object.keys(data[0])
    const lines: string[] = []

    // Add headers if enabled
    if (this.includeHeaders) {
      const headerLine = csvHeaders.map(header => this.escapeValue(header)).join(this.delimiter)
      lines.push(headerLine)
    }

    // Add data rows
    data.forEach(row => {
      const values = csvHeaders.map(header => this.escapeValue(row[header]))
      lines.push(values.join(this.delimiter))
    })

    return lines.join('\n')
  }

  /**
   * Downloads CSV data as a file
   */
  downloadCsv(data: Record<string, any>[], filename: string, headers?: string[]): void {
    const csvContent = this.toCsv(data, headers)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    
    // Create download link
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }
}

/**
 * Transforms Lawmatics contacts to Wealth Counsel format using field mappings
 */
export function transformContactsForWealthCounsel(contacts: any[], mappings: Record<string, Function>): Record<string, any>[] {
  return contacts.map(contact => {
    const transformedContact: Record<string, any> = {}
    
    Object.keys(mappings).forEach(wealthCounselField => {
      const mappingFunction = mappings[wealthCounselField]
      try {
        transformedContact[wealthCounselField] = mappingFunction(contact)
      } catch (error) {
        console.warn(`Error mapping field ${wealthCounselField}:`, error)
        transformedContact[wealthCounselField] = ''
      }
    })
    
    return transformedContact
  })
}

/**
 * Convenience function to export contacts to Wealth Counsel CSV format
 */
export function exportContactsToWealthCounselCsv(
  contacts: any[], 
  matterId: string,
  mappings: Record<string, Function>
): void {
  const exporter = new CsvExporter()
  
  // Transform contacts using the mappings
  const transformedContacts = transformContactsForWealthCounsel(contacts, mappings)
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const filename = `matter-${matterId}-contacts-${timestamp}.csv`
  
  // Download the CSV
  exporter.downloadCsv(transformedContacts, filename)
}