export default defineNuxtPlugin((nuxtApp) => {
  const { public: { lmFunction } } = useRuntimeConfig()

  const setSearchUrl = (searchType, searchTerm) => {
    const baseUrl = `${lmFunction}/contacts`
    
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

  const { public: { lmBasicAuth } } = useRuntimeConfig()

  const searchLm = async searchUrl => {
    try {
      // console.debug('searching with url: ', searchUrl)
      // const { data, status } = await $fetch(searchUrl, {
      const functionResponse = await $fetch(searchUrl, {
        headers: { authorization: `Basic ${lmBasicAuth}` },
        lazy: true
      }) 
      // console.debug('function fetch Response : ', JSON.parse(functionResponse))
      // const response = JSON.parse(functionResponse))
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