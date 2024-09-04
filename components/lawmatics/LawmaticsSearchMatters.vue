<template>
  <div class="ohl-tab-panel">
    <div class="lm-data">
      <fluent-search
        appearance="outline"
        placeholder="Search Matters..."
        v-model="searchTerm"
        @keyup="handleKeyUp"
      />
      <fluent-radio-group 
        orientation="horizontal" 
        name="searchSType" 
        :value="searchSType"
        @change="handleSearchSTypeChange"
      >
        <fluent-radio
          v-for="sType in searchSTypes"
          :key="sType.value"
          :value="sType.value"
        >
          {{ sType.label }}
        </fluent-radio>
      </fluent-radio-group>
      <fluent-button
        @click="runSearch"
        :disabled="!searchTerm"
      >
        Search Matters
      </fluent-button>
      <fluent-card v-if="searchHasRun">
        <div class='no-results' v-if="searchResults.length === 0">
          No matters found
        </div>
        <fluent-accordion
          v-else
          aria-labelledby="matterName"
          style="width: 100%;"
        >
          <LawmaticsAccordionItemMatter
            v-for="matter in searchResults"
            :key="matter.id"
            :matter="matter"
          />
        </fluent-accordion>
      </fluent-card>
    </div>
  </div>
</template>

<script setup>
const { $searchLm, $setSearchUrl } = useNuxtApp()

const searchTerm = ref('')
const searchSType = ref('last_name')
const searchResults = ref([])
const searchHasRun = ref(false)

const searchSTypes = [
  { value: 'last_name', label: 'Last Name' },
  { value: 'first_name', label: 'First Name' },
  { value: 'email', label: 'Email' }
]

const lmUrl = computed(() => 
  $setSearchUrl('prospects', searchSType.value, searchTerm.value)
)

const runSearch = async () => {
  searchHasRun.value = true
  searchResults.value = await $searchLm(lmUrl.value)
}

const handleKeyUp = (event) => {
  if (event.key === 'Enter') {
    runSearch()
  }
}

const handleSearchSTypeChange = (event) => {
  searchSType.value = event.target.value
  searchTerm.value = ''
  searchResults.value = []
  searchHasRun.value = false
}
</script>

<style scoped>
.ohl-tab-panel { width: 290px; }
.lm-data { display: inline-grid; gap: 15px; }
.matter-item { width: 100%; }
.no-results { padding: 1rem; }
</style>