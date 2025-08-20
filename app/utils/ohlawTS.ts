export const toKebabCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-0-9-]/g, '')
}

export const formatPhoneNumber = (phone: string | null): string => {
  if (!phone) return ''
  
  // Remove all non-digit characters and unprintable characters
  const digits = phone.replace(/[^\d]/g, '')
  
  // Check if we have a valid US phone number (10 digits)
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }
  
  // Check if we have 11 digits starting with 1 (US country code)
  if (digits.length === 11 && digits.startsWith('1')) {
    const usDigits = digits.slice(1)
    return `${usDigits.slice(0, 3)}-${usDigits.slice(3, 6)}-${usDigits.slice(6, 10)}`
  }
  
  // For other formats, return the cleaned digits or original if no digits found
  return digits || ''
}