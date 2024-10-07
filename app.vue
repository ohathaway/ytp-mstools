<template>
    <Header />
  <v-app>
    <main id="app-body" class="ms-welcome__main">
      <NuxtRouteAnnouncer />
      <fluent-tabs activeid="format" id="appTabs">
        <fluent-tab id="format">Format</fluent-tab>
        <!-- <fluent-tab id="lmData" @click="setFocus($event)">LM Data</fluent-tab> -->
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
  </v-app>
</template>

<script setup>
import.meta.client && Office.onReady()

const setFocus = event => {
  // const panelRoot = document.querySelector(`fluent-tab-panel#${event.target.id}Panel`)
  // const activeSearchTab = panelRoot.querySelector('fluent-tab[aria-selected="true"]')
    // .getAttribute('aria-controls')
  // const searchPanelRoot = panelRoot.querySelector(`fluent-tab-panel#${activeSearchTab}`)
  const searchRoot = document.querySelector('fluent-search').shadowRoot
  const searchInput = searchRoot.querySelector('input[type="search"]')
  searchInput.focus()
  // console.debug('searchInput: ', searchInput)
}
</script>

<style>
.formatPanel,
.lmDataPanel {
  width: 290px;
}

fluent-tab {
  padding: 0 6px;
}
</style>