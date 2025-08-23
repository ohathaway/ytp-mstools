<template>
  <div v-if="$officeState.isOfficeEnvironment">
    <!-- Office Layout Content - Constrained for Office Add-in -->
    <fluent-tabs activeid="format" id="appTabs">
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
  </div>

  <div v-else>
    <!-- Web Layout Content - Full-featured for standalone web app -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h2 class="text-h4">OHLaw Tools</h2>
          </v-card-title>
          <v-card-text>
            <p class="text-body-1 mb-4">
              Welcome to the standalone web version of OHLaw Tools. This version includes additional features 
              that are not available in the Office Add-in environment.
            </p>
            
            <v-row>
              <v-col cols="12" md="4">
                <v-card variant="outlined" class="h-100">
                  <v-card-title>
                    <v-icon icon="mdi-database" class="mr-2"></v-icon>
                    Lawmatics Data
                  </v-card-title>
                  <v-card-text>
                    <TabLmData />
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="4">
                <v-card variant="outlined" class="h-100">
                  <v-card-title>
                    <v-icon icon="mdi-form-textbox" class="mr-2"></v-icon>
                    Lawmatics Fields
                  </v-card-title>
                  <v-card-text>
                    <TabLmFields />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const { $layout, $officeState } = useNuxtApp()
</script>

<style scoped>
/* Office layout styles */
.office-layout .formatPanel,
.office-layout .lmDataPanel {
  width: 290px;
}

fluent-tab {
  padding: 6px 12px;
  /* Reduced vertical padding to maintain indicator alignment */
}

/* Office-specific tab constraints */
.office-layout fluent-tabs {
  max-width: 340px;
}

/* Web layout gets more space for cards */
.web-layout .v-card {
  min-height: 300px;
}
</style>