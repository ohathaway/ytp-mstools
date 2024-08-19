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
          v-model="contactable.search"
        />
        <fluent-radio-group
          orientation="horizontal"
          v-model="contactable.type"
        >
          <fluent-radio value="text" curren-checked>name</fluent-radio>
          <fluent-radio value="email">email</fluent-radio>
          <fluent-radio value="phone">phone</fluent-radio>
        </fluent-radio-group>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
const contactable = ref({ type: 'name', search: '' })

watchEffect(() => {
  console.debug('contactable: ', contactable)
})
const isLmAuthenticated = () => {
  return true
}


</script>

<style scoped>
.ohlTabPanel { width: 100%; }
.lmData { display: inline-grid; gap: 15px; }
</style>