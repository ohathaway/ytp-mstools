<template>
  <fluent-accordion-item>
    <span slot="heading">
      {{ attributes.last_name }} - {{ attributes.case_title }}
    </span>
    <div class="matter-details">
      <!-- <p><strong>Matter ID:</strong> {{ id }}</p> -->
      <p><strong>Status:</strong> {{ attributes.status }}</p>
      <p><strong>Joint Plan?:</strong> {{ jointPlan }}</p>
      <!-- <p><strong>Created At:</strong> {{ formattedCreatedAt }}</p> -->
      <!-- <p><strong>Updated At:</strong> {{ formattedUpdatedAt }}</p> -->
      <!-- Add more matter details as needed -->
      <v-btn
        v-if="trustName"
        class="text-none"
        rounded="sm"
        density="comfortable"
        variant="tonal"
        @click="insertInfo(trustName.formatted_value)"
        :id="`trust_name-${matter.id}`"
      >
        {{ trustName.formatted_value }}
      </v-btn>
      <LawmaticsDateButton
        v-if="trustOrWillDate"
        :date="trustOrWillDate.formatted_value"
        :objectId="matter.id"
        label="Trust or Will Date"
      />
      <v-btn
        class="text-none"
        rounded="sm"
        density="comfortable"
        variant="tonal"
        @click="openNewWindow(matterLink)"
      >
        Open in Lawmatics
        <IconsIconWrapper :icon="IconOpen" width="12" />
      </v-btn>
    </div>
  </fluent-accordion-item>
</template>

<script setup>
import { startCase } from 'lodash-es'
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

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const trustName = computed(() => {
  return attributes.custom_fields.filter(att => {
    return att.name === 'Trust Name'
  })[0] || ''
})

const trustOrWillDate = computed(() => {
  return attributes.custom_fields.filter(att => {
    return att.name === 'Trust or Will Date'
  })[0] || ''
})

const jointPlan = computed(() => {
  const jointPlan = attributes.custom_fields.filter(att => {
    return att.name === 'Joint Plan'
  })[0] 
  return jointPlan?.formatted_value || 'No'
})
</script>

<style scoped>
.matter-details {
  padding: 1rem;
}
.matter-details p {
  margin: 0.5rem 0;
}
</style>