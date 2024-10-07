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
        @click="insertInfo(`${attributes.first_name} ${attributes.middle_name} ${attributes.last_name}`)"
        :id="`fullname-${contact.id}`"
      >
        {{ attributes.first_name }} {{ attributes.middle_name }} {{ attributes.last_name }}
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
        v-if="attributes.suffix"
        class="text-none"
        rounded="sm"
        density="comfortable"
        variant="tonal"
        @click="insertInfo(attributes.suffix_name)"
        :id="`suffix-${contact.id}`"
      >
        {{ attributes.suffix }}
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
        :id="`phone-${contact - id}`"
      >
        {{ attributes.phone }}
      </v-btn>
      <LawmaticsDobButton
        v-if="attributes.birthdate"
        :birthdate="attributes.birthdate"
        :contactId="contact.id"
      />
      <v-btn
        v-if="attributes.address"
        class="text-none"
        rounded="sm"
        density="comfortable"
        variant="tonal"
        @click="insertInfo(stripCountry(attributes.address))"
        :id="`address-${contact.id}`"
      >
        {{ stripCountry(attributes.address) }}
      </v-btn>
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

const contactLink = computed(() => {
  return `https://app.lawmatics.com/contacts/${contact.id}/details`
})
</script>