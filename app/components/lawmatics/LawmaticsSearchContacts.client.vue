<template>
  <div class="ohl-tab-panel">
    <div class="lmLogin" v-if="!isLmAuthenticated">
      <fluent-button>
        Log In to Lawmatics
      </fluent-button>
    </div>
    <div class="lm-data" v-else>
      <ClientOnly>
        <fluent-search
          appearance="outline"
          placeholder="Search Contacts..."
          v-model="searchTerm"
          @keyup="handleKeyUp"
        />
      </ClientOnly>
      <fluent-radio-group 
        orientation="horizontal" 
        name="searchType" 
        :value="searchType"
        @change="handleSearchTypeChange"
      >
        <fluent-radio
          v-for="sType in searchTypes"
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
        Search Contacts
      </fluent-button>
      <fluent-card v-if="searchHasRun">
        <div class='no-results' v-if="searchResults.length === 0">
          No contacts found
        </div>
        <fluent-accordion
          v-else
          aria-labelledby="contactName"
          style="width: 100%;"
        >
          <LawmaticsAccordionItemContact
            v-for="contact in searchResults"
            :key="contact.id"
            :contact="contact"
          />
        </fluent-accordion>
      </fluent-card>
    </div>
  </div>
</template>

<script setup>
const { $searchLm, $setSearchUrl } = useNuxtApp()
const { toastError } = useToastStore()

const searchTerm = ref('')
const searchType = ref('last_name')
const searchResults = ref([])
const searchHasRun = ref(false)

const searchTypes = [
  { value: 'last_name', label: 'lname' },
  { value: 'first_name', label: 'fname' },
  { value: 'email', label: 'email' },
  { value: 'phone', label: 'phone' },
]

const lmUrl = computed(() => 
  $setSearchUrl('contacts', searchType.value, searchTerm.value)
)

// Replace with actual authentication logic
const isLmAuthenticated = computed(() => true)

const runSearch = async () => {
  try {
    searchHasRun.value = true
    searchResults.value = await $searchLm(lmUrl.value)
  } catch (error) {
    toastError(error)
  }
}

const handleKeyUp = (event) => {
  if (event.key === 'Enter') {
    runSearch()
  }
}

const handleSearchTypeChange = (event) => {
  searchType.value = event.target.value
  searchTerm.value = ''
  searchResults.value = []
  searchHasRun.value = false
}
</script>

<style scoped>
.ohl-tab-panel { width: 290px; }
.lm-data { display: inline-grid; gap: 15px; }
.contact-item { width: 100%; }
.no-results { padding: 1rem; }
</style>