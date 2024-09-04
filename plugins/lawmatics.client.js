export default defineNuxtPlugin((nuxtApp) => {
  const { public: { lmFunction, lmBasicAuth } } = useRuntimeConfig()

  const setSearchUrl = (endpoint, searchType, searchTerm) => {
    const baseUrl = `${lmFunction}/${endpoint}`
    
    const searchTypes = {
      last_name: 'last_name',
      first_name: 'first_name',
      email: 'email',
      phone: 'phone'
    }
    const params = new URLSearchParams({
      filter_field: searchTypes[searchType] || 'last_name',
      filter_value: `%${searchTerm.trim()}%`,
      filter_operator: 'ilike',
      fields: 'all'
    })
    return `${baseUrl}?${params.toString()}`
  }

  const searchLm = async searchUrl => {
    try {
      const functionResponse = await $fetch(searchUrl, {
        headers: { authorization: `Basic ${lmBasicAuth}` },
        lazy: true
      }) 
      return JSON.parse(functionResponse)
    } catch (error) {
      console.error(error.message)
      throw error
    }
  }

  return {
    provide: {
      searchLm,
      setSearchUrl
    }
  }
})