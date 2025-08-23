<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h2 class="text-h4">Advanced Tools</h2>
            <v-chip 
              v-if="!$officeState.isOfficeEnvironment" 
              color="success" 
              variant="outlined"
              class="ml-4"
            >
              Web-Only Features
            </v-chip>
          </v-card-title>
          <v-card-text>
            <p class="text-body-1 mb-4">
              These tools are available when running outside the Office Execution Environment.
            </p>
            
            <!-- Example of a feature that doesn't work in OEE -->
            <v-alert
              v-if="$officeState.isOfficeEnvironment"
              type="warning"
              class="mb-4"
            >
              Some features on this page are not available in the Office Add-in environment.
            </v-alert>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-card variant="outlined">
                  <v-card-title>
                    <v-icon icon="mdi-download" class="mr-2"></v-icon>
                    Bulk Export Tools
                  </v-card-title>
                  <v-card-text>
                    <p class="mb-3">Export Lawmatics data in various formats</p>
                    <div v-if="!$officeState.isOfficeEnvironment">
                      <v-btn color="primary" class="mr-2 mb-2">
                        Export to CSV
                      </v-btn>
                      <v-btn color="secondary" class="mr-2 mb-2">
                        Export to Excel
                      </v-btn>
                      <v-btn color="info" class="mb-2">
                        Export to PDF
                      </v-btn>
                    </div>
                    <v-alert v-else type="info" variant="outlined">
                      Export features are only available in the web version.
                    </v-alert>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-card variant="outlined">
                  <v-card-title>
                    <v-icon icon="mdi-api" class="mr-2"></v-icon>
                    API Management
                  </v-card-title>
                  <v-card-text>
                    <p class="mb-3">Manage API connections and settings</p>
                    <div v-if="!$officeState.isOfficeEnvironment">
                      <v-btn color="primary" class="mr-2 mb-2">
                        API Settings
                      </v-btn>
                      <v-btn color="warning" class="mb-2">
                        Test Connection
                      </v-btn>
                    </div>
                    <v-alert v-else type="info" variant="outlined">
                      API management is only available in the web version.
                    </v-alert>
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
const { $officeState } = useNuxtApp()

// Set page title
useSeoMeta({
  title: 'Advanced Tools - OHLaw'
})
</script>