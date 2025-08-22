<template>
  <v-app class="web-layout">
    <v-app-bar :elevation="1" v-if="isAuthenticated">
      <template #prepend>
        <v-img 
          src="/img/ohlaw_icon_circle_outline-64.png" 
          alt="OHLaw" 
          max-height="40"
          max-width="40"
          class="mr-3"
        />
      </template>

      <v-toolbar-title>
        OHLaw Tools
      </v-toolbar-title>

      <v-spacer />

      <template #append>
        <v-btn 
          v-for="item in menuItems" 
          :key="item.to"
          :to="item.to"
          text
          color="primary"
        >
          {{ item.text }}
        </v-btn>

        <v-btn
          @click="handleLogout"
          text
          color="error"
        >
          Logout
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <template v-if="isAuthenticated">
        <v-container fluid class="pa-6">
          <slot />
        </v-container>
      </template>
      
      <template v-else-if="!isLoading">
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
              <v-card class="elevation-12">
                <v-card-title class="text-center pa-6">
                  <div class="text-center">
                    <v-img 
                      src="/img/ohlaw_icon_circle_outline-64.png" 
                      alt="OHLaw" 
                      max-height="64"
                      max-width="64"
                      class="mx-auto mb-4"
                    />
                    <h1 class="text-h5 font-weight-bold">Welcome to OHLaw Tools</h1>
                    <p class="text-subtitle-1 mt-2">Please sign in with your @ohlawcolorado.com account</p>
                  </div>
                </v-card-title>
                
                <v-card-text class="pa-6">
                  <v-btn 
                    color="primary"
                    size="large"
                    block
                    :loading="isLoading"
                    @click="handleLogin"
                  >
                    Sign in with Google
                  </v-btn>
                  
                  <v-alert
                    v-if="loginError"
                    type="error"
                    class="mt-4"
                  >
                    {{ loginError }}
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>
      
      <template v-else>
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="auto">
              <div class="text-center">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  size="64"
                ></v-progress-circular>
                <p class="mt-4 text-h6">Loading...</p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-main>

    <v-footer app class="d-flex justify-center" v-if="isAuthenticated">
      <small>© {{ new Date().getFullYear() }} OHLaw Colorado - All Rights Reserved</small>
    </v-footer>
  </v-app>
</template>

<script setup>
const authStore = useAuthStore()
const { isAuthenticated, isLoading } = storeToRefs(authStore)

const loginError = ref('')

const menuItems = [
  { to: '/', text: 'Home' },
  { to: '/lawmatics', text: 'Lawmatics' },
  { to: '/tools', text: 'Tools' }
]

const handleLogin = async () => {
  try {
    loginError.value = ''
    await authStore.loginWithGoogle()
  } catch (error) {
    console.error('Login failed:', error)
    loginError.value = error?.message || 'Login failed. Please try again.'
  }
}

const handleLogout = async () => {
  await authStore.logout()
  navigateTo('/')
}
</script>