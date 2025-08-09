<template>
  <div v-if="store.mruFields.length > 0" class="mru-container">
    <h3>Recently Used Fields</h3>
    <ul class="mru-list" aria-label="Available fields">
      <LmFieldsFieldListItem
        v-for="item in store.mruFields"
        :key="item.field_label"
        :item="item"
        :isMruItem="true"
      />
    </ul>
    <hr class="mru-separator" />
  </div>
</template>

<script setup>
const store = useLawmaticsFieldsStore()
</script>

<style scoped>
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
  .mru-separator {
    border: 0;
    height: 1px;
    background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0));
    margin: 16px 0;
  }
}
</style>