export default defineNuxtPlugin((nuxtApp) => {
  // Early detection to prevent plugin loading in Office environment
  const isOfficeEnvironment = process.client && 
    !!(window.Office && window.Office.context)

  // Skip entire plugin in Office environment to prevent import issues
  if (isOfficeEnvironment) {
    console.debug('Skipping dynamic layout plugin in Office environment')
    return {
      provide: {
        layout: {
          current: ref('office'),
          isOfficeLayout: ref(true),
          isWebLayout: ref(false),
          switch: () => Promise.resolve()
        }
      }
    }
  }

  const layoutState = useState('layout', () => 'web') // Default to web

  // Watch office environment state to determine layout
  watch(
    () => nuxtApp.$officeState?.isOfficeEnvironment,
    (isOfficeEnv) => {
      const newLayout = isOfficeEnv ? 'office' : 'web'
      layoutState.value = newLayout
      setPageLayout(newLayout)
    },
    { immediate: true }
  )

  return {
    provide: {
      layout: {
        current: computed(() => layoutState.value),
        isOfficeLayout: computed(() => layoutState.value === 'office'),
        isWebLayout: computed(() => layoutState.value === 'web'),
        switch: async (newLayout: 'office' | 'web', destination?: string) => {
          layoutState.value = newLayout
          if (destination) {
            await navigateTo(destination)
          }
        }
      }
    }
  }
})