<!-- components/Toast.vue -->
<template>
  <div class="toast" :class="type">
    {{ message }}
    <button @click="$emit('close')" class="close-btn">&times;</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
  type: 'success' | 'error' | 'info'
}>()

defineEmits(['close'])
</script>

<style scoped>
.toast {
  position: relative;
  padding: 12px 24px;
  margin-bottom: 8px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
}

.success {
  background-color: #4caf50;
}

.error {
  background-color: #f44336;
}

.info {
  background-color: #2196f3;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
}
</style>