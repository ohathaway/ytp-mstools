<template>
  <fluent-accordion-item class="contact-item">
    <span slot="heading">
      {{ contact.attributes.last_name }}, {{ contact.attributes.first_name }}
    </span>
    <div class="panel">
      <v-btn
        v-if="attributes.first_name && attributes.last_name"
        class="text-none"
        rounded="sm"
        density="comfortable"
        variant="tonal"
        @click="insertInfo(`${attributes.first_name} ${attributes.last_name}`)"
        :id="`first_last-${contact.id}`"
      >
        {{ attributes.first_name }} {{ attributes.last_name }}
      </v-btn>
      <v-btn
        v-if="attributes.first_name && attributes.last_name && attributes.middle_name"
        class="text-none"
        rounded="sm"
        density="comfortable"
        variant="tonal"
        @click="insertInfo(fullName)"
        :id="`fullname-${contact.id}`"
      >
        {{ fullName }}
      </v-btn>
      <v-btn
        v-if="attributes.name_prefix"
        class="text-none"
        rounded="sm"
        density="comfortable"
        variant="tonal"
        @click="insertInfo(attributes.name_prefix)"
        :id="`suffix-${contact.id}`"
      >
        {{ attributes.name_prefix }}
      </v-btn>
      <v-btn
        v-if="attributes.first_name"
        class="text-none"
        rounded="sm"
        density="comfortable"
        variant="tonal"
        @click="insertInfo(attributes.first_name)"
        :id="`fname-${contact.id}`"
      >
        {{ attributes.first_name }}
      </v-btn>
      <v-btn
        v-if="attributes.middle_name"
        class="text-none"
        rounded="sm"
        density="comfortable"
        variant="tonal"
        @click="insertInfo(attributes.middle_name)"
        :id="`mname-${contact.id}`"
      >
        {{ attributes.middle_name }}
      </v-btn>
      <v-btn
        v-if="attributes.last_name"
        class="text-none"
        rounded="sm"
        density="comfortable"
        variant="tonal"
        @click="insertInfo(attributes.last_name)"
        :id="`lname-${contact.id}`"
      >
        {{ attributes.last_name }}
      </v-btn>
      <v-btn
        v-if="attributes.name_suffix"
        class="text-none"
        rounded="sm"
        density="comfortable"
        variant="tonal"
        @click="insertInfo(attributes.name_suffix)"
        :id="`suffix-${contact.id}`"
      >
        {{ attributes.name_suffix }}
      </v-btn>
      <v-btn
        v-if="attributes.email"
        class="text-none"
        rounded="sm"
        density="comfortable"
        variant="tonal"
        @click="insertInfo(attributes.email)"
        :id="`email-${contact.id}`"
      >
        {{ attributes.email }}
      </v-btn>
      <v-btn
        v-if="attributes.phone"
        class="text-none"
        rounded="sm"
        density="comfortable"
        variant="tonal"
        @click="insertInfo(attributes.phone)"
        :id="`phone-${contact.id}`"
      >
        {{ attributes.phone }}
      </v-btn>
      <LawmaticsDateButton
        v-if="attributes.birthdate"
        :date="attributes.birthdate"
        :objectId="contact.id"
        label="Date of Birth"
      />
      <LawmaticsAddressButton
        v-if="addressIds.length > 0"
        :addressIds="addressIds"
        :contactId="contact.id"
      >
        {{ stripCountry(attributes.address) }}
      </LawmaticsAddressButton>
      <v-btn
        class="text-none"
        rounded="sm"
        density="comfortable"
        variant="tonal"
        @click="openNewWindow(contactLink)"
      >
        Open in Lawmatics
        <IconsIconWrapper :icon="IconOpen" width="12" />
      </v-btn>
    </div>
  </fluent-accordion-item>
</template>

<script setup>
import IconOpen from '@/components/icons/IconOpen.vue'

const { contact } = defineProps(['contact'])
const attributes = contact.attributes
const addressIds = computed(() => contact.relationships?.addresses?.data?.map(({ id }) => id) ?? [])

const contactLink = computed(() => {
  return `https://app.lawmatics.com/contacts/${contact.id}/details`
})

const fullName = computed(() => {
  let fullName = `${attributes.first_name} ${attributes.middle_name} ${attributes.last_name}`
  if (attributes.name_suffix) fullName = `${fullName}, ${attributes.name_suffix}`
  return fullName
})
</script>