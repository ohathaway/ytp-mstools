export const openNewWindow = link => {
  window.open(link, '_blank', 'noopener,noreferrer')
}

export const stripCountry = address => {
  return address.replace(/\,\sUnited\sStates.*/, '')
}