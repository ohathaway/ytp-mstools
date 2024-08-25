<template>
  <div class="ohlTabPanel" style="width: 290px;">
    <div class="lmLogin" v-if="!isLmAuthenticated()">
      <fluent-button>
        Log In to Lawmatics
      </fluent-button>
    </div>
    <div class="lmData" v-else>
        <fluent-search
          appearance="outline"
          placeholder="Search ..."
          v-model="searchTerm"
        />
        <fluent-radio-group
          orientation="horizontal"
          name="searchType" 
          :value="searchType"
          @change="event => searchType = event.target.value"
        >
          <fluent-radio value="last_name">lname</fluent-radio>
          <fluent-radio value="first_name">fname</fluent-radio>
          <fluent-radio value="email">email</fluent-radio>
          <fluent-radio value="phone">phone</fluent-radio>
        </fluent-radio-group>
        <fluent-button @click="searchLm(lmUrl)" :disabled="!searchTerm">
          Search Lawmatics
        </fluent-button>
        <div v-if="searchResults">
          <fluent-accordion
            aria-labelledby="contactName"
            style="width: 100%;"
          >
            <fluent-accordion-item
              v-for="contact in searchResults"
              :key="contact.id"
              class="contact-item"
            >
              <span slot="heading">{{ contact.attributes.last_name }}, {{ contact.attributes.first_name }}</span>
              <div class="panel">
                <fluent-button @click="addInfo(contact.attributes.first_name)" :id="`fname-${contact.id}`">First Name</fluent-button>
                <!-- <fluent-tooltip :anchor="`fname-${contact.id}`">{{ contact.attributes.first_name }}</fluent-tooltip> -->
                <fluent-button :id="`lname-${contact.id}`">Last Name</fluent-button>
                <!-- <fluent-tooltip :anchor="`lname-${contact.id}`">{{ contact.attributes.last_name }}</fluent-tooltip> -->
                <fluent-button :id="`email-${contact.id}`">Email</fluent-button>
                <!-- <fluent-tooltip :anchor="`email-${contact.id}`">{{ contact.attributes.email }}</fluent-tooltip> -->
                <fluent-button :id="`phone-${contact-id}`">Phone</fluent-button>
                <!-- <fluent-tooltip :anchor="`phone-${contact.id}`">{{ contact.attributes.phone }}</fluent-tooltip> -->
                <fluent-button :id="`address-${contact.id}`">Address</fluent-button>
                <!-- <fluent-tooltip :anchor="`address-${contact.id}`">{{ contact.attributes.address }}</fluent-tooltip> -->
              </div>
            </fluent-accordion-item>
          </fluent-accordion>
        </div>
    </div>
  </div>
</template>

<script setup>
const { $setSearchUrl } = useNuxtApp()

const searchTerm = ref()
const searchType = ref('last_name')
const lmUrl = ref()
const searchResults = ref([])

const isLmAuthenticated = () => {
  return true
}

watchPostEffect(() => {
  lmUrl.value = $setSearchUrl(searchType.value, searchTerm.value)
})

const { public: { lmBasicAuth } } = useRuntimeConfig()

const searchLm = async searchUrl => {
  try {
  const { data, status, error } = await $fetch(searchUrl, {
    headers: { authorization: `Basic ${lmBasicAuth}` },
    lazy: true
  }) 
  searchResults.value = data
  return { data, status, error }
  } catch (error) {
    searchResults.value = error.message
  }
}

const insertInfo = async info => {
  await Word.run(async context => {
    const range = context.document.getSelection()
    range.insertText(info, 'Before')

    await context.sync()
  })
}
</script>

<style scoped>
.ohlTabPanel { width: 100%; }
.lmData { display: inline-grid; gap: 15px; }
.contact-item { width: 100%; }
</style>