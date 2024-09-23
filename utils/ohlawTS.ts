export const toKebabCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-0-9-]/g, '')
}