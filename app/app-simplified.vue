<template>
  <!-- <NuxtPage /> -->
  <NuxtLayout>
    <button @click="handleLogin">Login</button>
  </NuxtLayout>
</template>

<script setup>
import.meta.client && Office.onReady()
const authStore = useAuthStore()

const handleLogin = async () => {
  try {
    await authStore.loginWithGoogle()
  } catch (error) {
    console.error('Login error:', error)
  }
}
</script>