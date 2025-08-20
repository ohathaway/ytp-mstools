<template>
  <NuxtLayout>
    <div>
      <!-- Main app content will be rendered by app.vue layout -->
    </div>
  </NuxtLayout>
</template>

<script setup>
// Since we have pages/ directory, Nuxt expects index.vue for root route
// This page uses the default layout which will render app.vue
definePageMeta({
  layout: 'default'
})
</script>