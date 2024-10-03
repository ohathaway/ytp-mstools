<template>
  <!-- <v-btn :id="`birthdate-button-${contactId}`"> -->
  <v-btn>
    Date of Birth
    <!--
    <v-menu
      :id="`birthdate-menu-${contactId}`"
      activator="parent"
    >
      <v-list>
        <v-list-item @click="insertFormattedDate('MM/DD/YYYY')">
          <v-list-item-title>MM/DD/YYYY</v-list-item-title>
        </v-list-item>
        <v-list-item @click="insertFormattedDate('MMMM DD, YYYY')">
          <v-list-item-title>Month D, YYYY</v-list-item-title>
        </v-list-item>
        <v-list-item @click="insertFormattedDate('D MMMM YYYY')">
          <v-list-item-title>D MMMM YYYY</v-list-item-title>
        </v-list-item>
        <v-list-item @click="insertFormattedDate('YYYY-MM-DD')">
          <v-list-item-title>YYYY-MM-DD</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    -->
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