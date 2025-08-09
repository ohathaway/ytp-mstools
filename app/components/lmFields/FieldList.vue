<template>
  <div v-if="store.isLoading">Loading fields ...</div>
  <ul v-else class="filtered-list" aria-label="Available fields">
    <LmFieldsFieldListItem
      v-for="item in store.filteredFields"
      :key="item.field_label"
      class="list-item"
      :item="item"
    />
  </ul>
</template>

<script setup>
const store = useLawmaticsFieldsStore()

onMounted(() => {
  store.fetchFields()
})
</script>

<style scoped>
.filtered-list {
  list-style-type: none;
  padding: 0;
  margin-top: 16px;
}
</style>