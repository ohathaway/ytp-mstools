export const openNewWindow = link => {
  window.open(link, '_blank', 'noopener,noreferrer')
}

export const stripCountry = address => {
  return address.replace(/\,\sUnited\sStates.*/, '')
}

export const relType = input => 
  (input === 'Client' && '') || 
  `rel_${input.toLowerCase().replace(/ /g, '_')}|`

export const debounce = (func, wait) => {
  let timeout

  return (...args) => {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}