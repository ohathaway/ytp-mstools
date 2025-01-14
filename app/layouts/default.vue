// layouts/default.vue
<template>
  <div class="office-addin-container">
    <slot />
  </div>
</template>

<script setup>
// Add any layout-specific logic here
</script>

<style>
.office-addin-container {
  height: 100vh;
  width: 100%;
  overflow-y: auto;
}
</style>