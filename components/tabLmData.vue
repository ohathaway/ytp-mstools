<template>
  <div class="ohl-tab-panel" style="width: 290px;">
    <div class="lmLogin" v-if="!isLmAuthenticated()">
      <fluent-button>
        Log In to Lawmatics
      </fluent-button>
    </div>
    <div class="lm-data" v-else>
      <fluent-search appearance="outline" placeholder="Search ..." v-model="searchTerm" />
      <fluent-radio-group orientation="horizontal" name="searchType" :value="searchType"
        @change="event => searchType = event.target.value">
        <fluent-radio value="last_name">lname</fluent-radio>
        <fluent-radio value="first_name">fname</fluent-radio>
        <fluent-radio value="email">email</fluent-radio>
        <fluent-radio value="phone">phone</fluent-radio>
      </fluent-radio-group>
      <fluent-button @click="runSearch(lmUrl)" :disabled="!searchTerm">
        Search Lawmatics
      </fluent-button>
      <div v-if="searchHasRun">
        <fluent-card>
          <div class='no-results' v-if="searchResults.length === 0">
            No results found
          </div>
          <fluent-accordion aria-labelledby="contactName" style="width: 100%;">
            <LawmaticsContactAccordionItem
              v-for="contact in searchResults"
              :key="contact.id"
              :contact="contact" />
          </fluent-accordion>
        </fluent-card>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $searchLm, $setSearchUrl } = useNuxtApp()

const searchTerm = ref('')
const searchType = ref('last_name')
const lmUrl = ref()
const searchResults = ref([])
const searchHasRun = ref(false)

const isLmAuthenticated = () => {
  return true
}

watchPostEffect(() => {
  lmUrl.value = $setSearchUrl(searchType.value, searchTerm.value)
})

const runSearch = async url => {
  searchHasRun.value = true
  const lmResults = await $searchLm(url)
  searchResults.value = lmResults
}
</script>

<style scoped>
.ohl-tab-panel { width: 100%; }
.lm-data { display: inline-grid; gap: 15px; }
.contact-item { width: 100%; }
.no-results { padding: 1rem;}
</style>