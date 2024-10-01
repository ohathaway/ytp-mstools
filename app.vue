<template>
  <Header />
  <main id="app-body" class="ms-welcome__main">
    <NuxtRouteAnnouncer />
    <fluent-tabs activeid="format">
      <fluent-tab id="format">Format</fluent-tab>
      <fluent-tab id="lmData">LM Data</fluent-tab>
      <fluent-tab id="lmFields">LM Fields</fluent-tab>

      <fluent-tab-panel id="formatPanel">
        <TabFormat />
      </fluent-tab-panel>
      <fluent-tab-panel id="lmDataPanel">
        <TabLmData />
      </fluent-tab-panel>
      <fluent-tab-panel id="lmFieldsPanel">
        <TabLmFields />
      </fluent-tab-panel>
    </fluent-tabs>
  </main>
</template>

<script setup>
Office.onReady()
</script>

<style scoped>
.formatPanel,
.lmDataPanel {
  width: 290px;
}
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}
</style>