<template>
  <header class="ms-welcome__header ms-bgColor-neutralLighter">
    <a target="_blank" href="https://ohlawcolorado.com" rel="noopener noreferrer">
      <!-- <inline-svg width="90" height="90" src="../../assets/ohlaw_icon_circle_outline.svg" alt="OHLaw" title="OHLaw" /> -->
      <!-- <div v-html="rawLogo" /> -->
      <img width="90" height="90" src="~/assets/ohlaw_icon_circle_outline.svg?data" alt="OHLaw" title="OHLaw" />
      <!--
      <br>
      <fluent-button
        v-if="!isAuthenticated"
        @click="handleLogin()"
      >
        Login
      </fluent-button>
      <fluent-button
        v-else
        @click="handleLogout()"
      >
        Logout
      </fluent-button>
      -->
    </a>
  </header>
</template>

<script setup>
const authStore = useAuthStore()
// import.meta.client && Office.onReady()

const { isAuthenticated } = storeToRefs(authStore)
const authInit = ref(false)

const handleLogin = async () => {
  try {
    await authStore.loginWithGoogle()
  } catch (error) {
    console.error('Login error:', error)
  }
}

const handleLogout = async () => true

watchEffect(() => {
  if (authStore && isAuthenticated.value) authInit.value = true
})

</script>

<style scoped>
header { background: #f3f2f1; }
</style>