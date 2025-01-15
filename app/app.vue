<template>
  <template v-if="authInit">
    <v-app>
      <Header />
      <main id="app-body" class="ms-welcome__main">
        <NuxtPage />
        <fluent-tabs activeid="format" id="appTabs">
          <fluent-tab id="format">Format</fluent-tab>
          <!-- <fluent-tab id="lmData" @click="setFocus($event)">LM Data</fluent-tab> -->
          <fluent-tab id="lmData">LM Data</fluent-tab>
          <fluent-tab id="lmFields">LM Fields</fluent-tab>

          <fluent-tab-panel id="formatPanel">
            <TabFormat />
          </fluent-tab-panel>
          <fluent-tab-panel id="lmDataPanel">
            <TabLmData />
          </fluent-tab-panel>
          <fluent-tab-panel id="lmFieldsPanel">
            <TabLmFields />
          </fluent-tab-panel>
        </fluent-tabs>
      </main>
    </v-app>
  </template>
  <template v-else>
    <h1 class="text-h3 mb-6">Welcome to OHLaw Tools</h1>
    <v-btn
      color="primary"
      size="large"
      @click="handleLogin"
    >
      Login with Google
    </v-btn>
  </template>
</template>

<script setup>
const authStore = useAuthStore()
import.meta.client && Office.onReady()

const { isAuthenticated } = storeToRefs(authStore)
const authInit = ref(false)

const handleLogin = async () => {
  try {
    await authStore.loginWithGoogle()
  } catch (error) {
    console.error('Login error:', error)
  }
}

watchEffect(() => {
  if (authStore && isAuthenticated.value) authInit.value = true
})

const setFocus = event => {
  // const panelRoot = document.querySelector(`fluent-tab-panel#${event.target.id}Panel`)
  // const activeSearchTab = panelRoot.querySelector('fluent-tab[aria-selected="true"]')
    // .getAttribute('aria-controls')
  // const searchPanelRoot = panelRoot.querySelector(`fluent-tab-panel#${activeSearchTab}`)
  const searchRoot = document.querySelector('fluent-search').shadowRoot
  const searchInput = searchRoot.querySelector('input[type="search"]')
  searchInput.focus()
  // console.debug('searchInput: ', searchInput)
}
</script>

<style>
.formatPanel,
.lmDataPanel {
  width: 290px;
}

fluent-tab {
  padding: 0 6px;
}
</style>