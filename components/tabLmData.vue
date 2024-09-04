<template>
  <div class="ohl-tab-panel">
    <div class="lmLogin" v-if="!isLmAuthenticated">
      <fluent-button>
        Log In to Lawmatics
      </fluent-button>
    </div>
    <div class="lm-data" v-else>
      <fluent-tabs activeid="contacts">
        <fluent-tab id="contacts">Contacts</fluent-tab>
        <fluent-tab id="matters">Matters</fluent-tab>
      
        <fluent-tab-panel id="contactsPanel">
          <LawmaticsSearchContacts />
        </fluent-tab-panel>
        <fluent-tab-panel id="mattersPanel">
          <LawmaticsSearchMatters />
        </fluent-tab-panel>
      </fluent-tabs>
    </div>
  </div>
</template>

<script setup>
// Replace with actual authentication logic
const isLmAuthenticated = computed(() => true)
</script>

<style scoped>
.ohl-tab-panel {
  width: 290px;
}
.lm-data {
  display: inline-grid;
  gap: 15px;
}
</style>