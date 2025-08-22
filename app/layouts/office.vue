<template>
  <v-app class="office-layout">
    <template v-if="isAuthenticated">
      <Header />
      <main id="app-body" class="ms-welcome__main">
        <fluent-tabs activeid="format" id="appTabs">
          <fluent-tab id="format">Format</fluent-tab>
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
    </template>
    
    <template v-else-if="!isLoading">
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <img src="/img/ohlaw_icon_circle_outline-64.png" alt="OHLaw" class="login-logo">
            <h1 class="login-title">Welcome to OHLaw Tools</h1>
            <p class="login-subtitle">Please sign in with your @ohlawcolorado.com account</p>
          </div>
          
          <fluent-button 
            appearance="accent" 
            size="large"
            :disabled="isLoading"
            @click="handleLogin"
            class="login-button"
          >
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign in with Google</span>
          </fluent-button>
          
          <div v-if="loginError" class="login-error">
            {{ loginError }}
          </div>
        </div>
      </div>
    </template>
    
    <template v-else>
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    </template>
  </v-app>
</template>

<script setup>
const authStore = useAuthStore()
const { isAuthenticated, isLoading } = storeToRefs(authStore)

const loginError = ref('')

const handleLogin = async () => {
  try {
    loginError.value = ''
    await authStore.loginWithGoogle()
  } catch (error) {
    console.error('Login failed:', error)
    loginError.value = error?.message || 'Login failed. Please try again.'
  }
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

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 280px;
  width: 100%;
}

.login-header {
  margin-bottom: 24px;
}

.login-logo {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}

.login-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.login-subtitle {
  color: #7f8c8d;
  font-size: 13px;
  margin: 0;
  line-height: 1.4;
}

.login-button {
  width: 100%;
  margin: 16px 0;
  height: 40px;
  font-size: 14px;
}

.login-error {
  color: #e74c3c;
  background: #fdf2f2;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 20px;
  border: 1px solid #fecdd3;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: #7f8c8d;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>