<template>
  <fluent-accordion-item>
    <span slot="heading">
      {{ attributes.last_name }} - {{ attributes.case_title }}
    </span>
    <div class="matter-details">
      <!-- <p><strong>Matter ID:</strong> {{ id }}</p> -->
      <p><strong>Status:</strong> {{ attributes.status }}</p>
      <!-- <p><strong>Created At:</strong> {{ formattedCreatedAt }}</p> -->
      <!-- <p><strong>Updated At:</strong> {{ formattedUpdatedAt }}</p> -->
      <!-- Add more matter details as needed -->
      <fluent-button class="opener" @click="openNewWindow(matterLink)">
        Open in Lawmatics
        <IconsIconWrapper :icon="IconOpen" width="12" />
      </fluent-button>
    </div>
  </fluent-accordion-item>
</template>

<script setup>
import IconOpen from '@/components/icons/IconOpen.vue'

const { matter } = defineProps({
  matter: {
    type: Object,
    required: true
  }
})

const attributes = matter.attributes

const matterLink = computed(() => {
  return `https://app.lawmatics.com/matters/${matter.id}/details`
})

console.debug('attributes.case_title: ', attributes.case_title)

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formattedCreatedAt = computed(() => formatDate(created_at))
const formattedUpdatedAt = computed(() => formatDate(updated_at))
</script>

<style scoped>
.matter-details {
  padding: 1rem;
}
.matter-details p {
  margin: 0.5rem 0;
}
</style>