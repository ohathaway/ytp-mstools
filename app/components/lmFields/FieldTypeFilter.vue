<template>
  <div class="field-type-filter">
    <label for="field-type-selector">Filter by Type</label>
    <fluent-select
      id="field-type-selector"
      appearance="outline"
      v-model="store.fieldTypeFilter"
      aria-label="Filter fields by type"
    >
      <fluent-option value="All">All Types</fluent-option>
      <fluent-option value="Contact">Contact</fluent-option>
      <fluent-option value="Matter">Matter</fluent-option>
      <fluent-option value="General">General</fluent-option>
    </fluent-select>
    <fluent-tooltip
      anchor="field-type-selector"
      position="top"
    >
      Filter fields by their type
    </fluent-tooltip>
  </div>
</template>

<script setup>
const store = useLawmaticsFieldsStore()
</script>

<style scoped>
label {
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
}

.field-type-filter {
  margin-bottom: 12px;
}

fluent-select {
  width: 100%;
}
</style>