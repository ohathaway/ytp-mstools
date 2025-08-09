<template>
  <div class="input-wrapper">
    <label>Filter Fields</label>
    <fluent-search
      id="search-bar"
      appearance="outline"
      placeholder="Search for a field..."
      v-model="store.filterText"
      title="Type to filter available fields"
      aria-label="Type to filter available fields"
      @change="debouncedSetFilterText"
    />
    <fluent-tooltip anchor="search-bar">Type to filter available fields</fluent-tooltip>
  </div>
</template>

<script setup>
import { debounce } from 'lodash-es'
const store= useLawmaticsFieldsStore()

const debouncedSetFilterText = debounce(
  event => store.setFilterText(event.target.value)
  , 300)
</script>

<style scoped>
label {
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
}

fluent-search {
  width: 100%;
}
</style>