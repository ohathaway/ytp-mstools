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
          <fluent-radio value="text">name</fluent-radio>
          <fluent-radio value="email">email</fluent-radio>
          <fluent-radio value="phone">phone</fluent-radio>
        </fluent-radio-group>
    </div>
  </div>
</template>

<script setup>
// import { ref, watchEffect } from 'vue'

const searchTerm = ref()
const searchType = ref('text')

const isLmAuthenticated = () => {
  return true
}

const config = useRuntimeConfig()

const authHeader = { authorization: `Basic ${config.public.lmBasicAuth}` }
const endpoint = 'https://us-west3-www-prod-389819.cloudfunctions.net/nodejs-http-lmGetData/prospects/find_by_email/ohathawa@gmail.com?fields=all'
const { data, status, error } = await useFetch(endpoint, {
  headers: authHeader,
  lazy: true
}) 
</script>

<style scoped>
.ohlTabPanel { width: 100%; }
.lmData { display: inline-grid; gap: 15px; }
</style>