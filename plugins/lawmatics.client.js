export default defineNuxtPlugin((nuxtApp) => {
  const { public: { lmUrl } } = useRuntimeConfig()

  const setSearchUrl = (searchType, searchTerm) => {
    const baseUrl = `${lmUrl}/contacts`
    
    const searchTypes = {
      last_name: 'last_name',
      first_name: 'first_name',
      email: 'email',
      phone: 'phone'
    }

    const params = new URLSearchParams({
      filter_field: searchTypes[searchType] || 'last_name',
      filter_value: searchTerm,
      filter_operator: 'ilike',
      fields: 'all'
    })

    return `${baseUrl}?${params.toString()}`
  }

  return {
    provide: {
      setSearchUrl
    }
  }
})