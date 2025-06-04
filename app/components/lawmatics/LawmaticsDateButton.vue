<template>
  <!-- <v-btn :id="`birthdate-button-${contactId}`"> -->
  <v-btn
    class="text-none"
    rounded="sm"
    density="comfortable"
    variant="tonal"
  >
    {{ label }}
    <v-menu
      :id="`birthdate-menu-${objectId}`"
      activator="parent"
    >
      <v-list>
        <v-list-item
          v-for="format in formats"
          :key="format"
          @click="insertFormattedDate(format)"
        >
          <v-list-item-title>{{ dayjs(date).format(format) || label }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup>
import dayjs from 'dayjs'

const props = defineProps({
  date: {
    type: String,
    required: true
  },
  objectId: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String
  }
})

const formats = [
  'MM/DD/YYYY',
  'MMMM DD, YYYY',
  'D MMMM YYYY',
  'YYYY-MM-DD'
]

const insertFormattedDate = format => {
  const formattedDate = dayjs(props.date).format(format)
  insertInfo(formattedDate)
}
</script>

<style scoped>
.lawmatics-date-field {
  position: relative;
  display: inline-block;
}

fluent-menu {
  position: absolute;
  z-index: 1000;
}
</style>