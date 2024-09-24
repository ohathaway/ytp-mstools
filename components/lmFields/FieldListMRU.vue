<template>
  <div v-if="store.mruFields.length > 0" class="mru-container">
    <h3>Recently Used Fields</h3>
    <ul class="mru-list" aria-label="Available fields">
      <LmFieldsFieldListItem
        v-for="item in store.mruFields"
        :key="item.field_label"
        :item="item"
      />
    </ul>
  </div>
</template>

<script setup>
const store = useLawmaticsFieldsStore()
</script>

<style lang="scss" scoped>
.mru-container {
  margin-bottom: 16px;

  h3 {
    font-size: 1em;
    margin-bottom: 8px;
  }

  .mru-list {
    list-style-type: none;
    padding: 0;
  }
}
</style>