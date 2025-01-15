<template>
  <!-- <v-btn :id="`birthdate-button-${contactId}`"> -->
  <v-btn
    class="text-none"
    rounded="sm"
    density="comfortable"
    variant="tonal"
  >
    Date of Birth
    <v-menu
      :id="`birthdate-menu-${contactId}`"
      activator="parent"
    >
      <v-list>
        <v-list-item
          v-for="format in formats"
          :key="format"
          @click="insertFormattedDate(format)"
        >
          <v-list-item-title>{{ dayjs(birthdate).format(format) }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup>
import dayjs from 'dayjs'

const props = defineProps({
  birthdate: {
    type: String,
    required: true
  },
  contactId: {
    type: [String, Number],
    required: true
  }
})

const formats = [
  'MM/DD/YYYY',
  'MMMM DD, YYYY',
  'D MMMM YYYY',
  'YYYY-MM-DD'
]

const insertFormattedDate = format => {
  const formattedDate = dayjs(props.birthdate).format(format)
  insertInfo(formattedDate)
}
</script>

<style scoped>
.date-of-birth-field {
  position: relative;
  display: inline-block;
}

fluent-menu {
  position: absolute;
  z-index: 1000;
}
</style>