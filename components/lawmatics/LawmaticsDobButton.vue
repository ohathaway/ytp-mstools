<template>
  <fluent-menu :id="`birthdate-${contactId}`">
    <fluent-button slot="trigger">
      Date of Birth
    </fluent-button>

    <fluent-menu-item @click="insertFormattedDate('MM/DD/YYYY')">
      MM/DD/YYYY
    </fluent-menu-item>
    <fluent-menu-item @click="insertFormattedDate('MMMM DD, YYYY')">
      Month D, YYYY
    </fluent-menu-item>
    <fluent-menu-item @click="insertFormattedDate('D MMMM YYYY')">
      D MMMM YYYY
    </fluent-menu-item>
    <fluent-menu-item @click="insertFormattedDate('YYYY-MM-DD')">
      YYYY-MM-DD
    </fluent-menu-item>
  </fluent-menu>
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