<template>
  <header class="header-container">
    <div class="header-content">
      <a target="_blank" href="https://ohlawcolorado.com" rel="noopener noreferrer" class="logo-link">
        <img width="32" height="32" src="~/assets/ohlaw_icon_circle_outline.svg?data" alt="OHLaw" title="OHLaw" />
        <span class="logo-text">OHLaw Tools</span>
      </a>
      
      <fluent-button
        appearance="stealth"
        @click="handleLogout"
        title="Sign out"
        class="logout-button"
      >
        <span class="logout-icon">⏻</span>
      </fluent-button>
    </div>
    
    <div class="user-info" v-if="user?.email">
      <span class="user-email" :title="user.email">{{ user.displayName || user.email }}</span>
    </div>
  </header>
</template>

<script setup>
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const handleLogout = async () => {
  await authStore.logout()
}
</script>

<style scoped>
.header-container {
  background: #f3f2f1;
  padding: 8px 12px;
  border-bottom: 1px solid #e1dfdd;
  width: 100%;
  box-sizing: border-box;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #323130;
}

.logo-link:hover {
  color: #106ebe;
}

.logo-text {
  font-size: 14px;
  font-weight: 600;
}

.logout-button {
  padding: 4px 8px;
  min-width: 32px;
  height: 32px;
}

.logout-icon {
  font-size: 16px;
}

.user-info {
  margin-top: 4px;
}

.user-email {
  font-size: 11px;
  color: #605e5c;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
}
</style>