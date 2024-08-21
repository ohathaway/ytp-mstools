export const useNameSearch = contactableName => {
  return `contacts/find_by_name/${encodeURIComponent(contactableName)}`
}