<template>
  <div class="ohl-tab-panel">
    <div class="lm-fields">
      <div class="filter-component">
        <LmFieldsRelationshipSelector />
        <LmFieldsFieldTypeFilter />
        <LmFieldsFieldSearch />
        <LmFieldsFieldListMRU />
        <LmFieldsFieldList />
      </div>
    </div>
  </div>
</template>

<script setup>
const store = useLawmaticsFieldsStore()
const { $lmFields } = useNuxtApp()

onMounted(async () => {
  await store.fetchRelationshipTypes()
  store.setFields($lmFields)
})
</script>

<style>
:root {
  --border-color: #d1d1d1;
  --hover-color: #e1e1e1;
  --active-color: #d1d1d1;
  --disabled-opacity: 0.5;
  --field-height: 20px;
  --button-background-color: #f3f3f3;
  --primary-text-color: #333333;
  --secondary-text-color: #666666;
  --primary-font: 'Arial', sans-serif;
}

.ohl-tab-panel {
  width: 290px;
  font-family: var(--primary-font);
  color: var(--primary-text-color);
}

.lm-fields {
  display: inline-grid;
  gap: 15px;
}
</style>