import Fuse from 'fuse.js'

export const useLawmaticsFieldsStore = defineStore('lawmaticsFields', () => {
  const fields = ref([])
  const filterText = ref('')
  const currentRelType = ref('Client')
  const repeatableIndex = ref(1)
  const relationshipTypes = ref([])
  const isLoading = ref(false)
  const fuse = ref(null)
  const mruFields = ref([])

  const sortedRelationshipTypes = computed(() => {
    const clientType = { id: 0, attributes: { name: 'Client' }}
    return sortRelationshipTypes([clientType, ...relationshipTypes.value])
  })

  const filteredFields = computed(() => {
    const searchText = (filterText.value ?? '').toLowerCase()
    return (searchText && fuse.value)
      ? fuse.value.search(searchText).map(result => result.item)
      : fields.value.filter(field => {
          const label = (field?.field_label ??'').toLowerCase()
          const macro = (field?.field_macro ?? '').toLowerCase()
          return label.includes(searchText) || macro.includes(searchText)
        })
  })

  const isCurrentRelTypeRepeatable = computed(() => {
    const currentRel = relationshipTypes.value.find(
        rel => rel.attributes.name === currentRelType.value
    )
    return Boolean(currentRel?.attributes.is_repeatable)
  })

  const relationshipPrefix = computed(() => {
    const currentRel = relationshipTypes.value.find(
        rel => rel.attributes.name === currentRelType.value
    )
    const relTypePrefix = currentRelType.value === 'Client'
      ? ''
      : `rel_${currentRelType.value.toLowerCase()}`
    const indexSuffix = currentRel?.attributes.is_repeatable
      ? `_${repeatableIndex.value}`
      : ''
    return `${relTypePrefix}${indexSuffix}`
  })

  // Combined set function
  const setState = (key, value) => {
    switch (key) {
      case 'fields':
        fields.value = value
        initFuse()
        break
      case 'filterText':
        filterText.value = value
        break
      case 'currentRelType':
        currentRelType.value = value
        break
      case 'repeatableIndex':
        repeatableIndex.value = value
        break
      case 'relationshipTypes':
        relationshipTypes.value = value
        break
      default:
        console.warn(`Attempted to set unknown state key: ${key}`)
    }
  }

  const setFields = newFields => setState('fields', newFields)
  const setFilterText = text => setState('filterText', text)
  const setCurrentRelType = type => setState('currentRelType', type)
  const setRepeatableIndex = index => setState('repeatableIndex', index)
  const setRelationshipTypes = types => setState('relationshipTypes', types)

  const fetchRelationshipTypes = async () => {
    isLoading.value = true
    try {
      const { $searchLm } = useNuxtApp()
      const { public: { lmFunction } } = useRuntimeConfig()
      const response = await $searchLm(`${lmFunction}/relationship_types`)
      setRelationshipTypes(response)
    } catch (error) {
      console.error('Failed to fetch relationships from lawmatics')
    } finally {
      isLoading.value = false
    }
  }

  const sortRelationshipTypes = types => {
    const priorityOrder = [
      'Client',
      'Spouse',
      'Child',
      'Step-child',
      'Grandchild',
      'Owner'
    ]
    
    return types.sort((a, b) => {
      const aName = a.attributes.name
      const bName = b.attributes.name
      const aIndex = priorityOrder.indexOf(a.attributes.name)
      const bIndex = priorityOrder.indexOf(b.attributes.name)
  
      return (
        aIndex === bIndex
          ? aName.localeCompare(bName)
          : (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex)
      )
    })
  }

  const fetchFields = () => {
    isLoading.value = true
    try {
      const { $lmFields } = useNuxtApp()
      setFields($lmFields)
    } catch (error) {
      console.error('Failed to load lawmatics fields from config')
    } finally {
      isLoading.value = false
    }
  }

  const initFuse = () => {
    fuse.value = new Fuse(fields.value, {
      keys: ['field_label', 'field_macro'],
      threshold: 0.4,
      ignoreLocation: true
    })
  }

  const addToMRU = (field, fullMacro) => {
    const newMruItem = { ...field, fullMacro }
    mruFields.value = [
      newMruItem,
      ...mruFields.value.filter(f => f.field_label !== field.field_label)
    ].slice(0,3)
  }

  return {
    addToMRU,
    currentRelType,
    fetchFields,
    fetchRelationshipTypes,
    fields,
    filterText,
    filteredFields,
    isCurrentRelTypeRepeatable,
    isLoading,
    mruFields,
    setCurrentRelType,
    setFields,
    setFilterText,
    setRepeatableIndex,
    setRelationshipTypes,
    setState,
    sortedRelationshipTypes,
    relationshipPrefix,
    relationshipTypes,
    repeatableIndex
  }
})