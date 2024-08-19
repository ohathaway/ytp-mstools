<template>
  <div class="ohlTabPanel" style="width: 290px;">
    <h2 class="ms-font-xl"> Hack away at this document </h2>

    <EditStylesSection />

    <hr width="100" />

    <FontSection />

    <hr width="100" />

    <InsertSection />

    <hr width="100" />

    <ResourceSection />
  </div>
</template>

<script setup>
import EditStylesSection from './sectionEditStyles.vue'
import FontSection from './sectionFonts.vue'
import InsertSection from './sectionInserts.vue'
import ResourceSection from './sectionResources.vue'
</script>