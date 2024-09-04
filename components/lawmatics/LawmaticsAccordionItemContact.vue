<template>
  <fluent-accordion-item class="contact-item">
    <span slot="heading">
      {{ contact.attributes.last_name }}, {{ contact.attributes.first_name }}
    </span>
    <div class="panel">
      <fluent-button v-if="attributes.first_name && attributes.last_name"
        @click="insertInfo(`${attributes.first_name} ${attributes.last_name}`)" :id="`first_last-${contact.id}`">
        {{ attributes.first_name }} {{ attributes.last_name }}
      </fluent-button>
      <fluent-button v-if="attributes.first_name && attributes.last_name && attributes.middle_name"
        @click="insertInfo(`${attributes.first_name} ${attributes.middle_name} ${attributes.last_name}`)"
        :id="`fullname-${contact.id}`">
        {{ attributes.first_name }} {{ attributes.middle_name }} {{ attributes.last_name }}
      </fluent-button>
      <fluent-button v-if="attributes.first_name" @click="insertInfo(attributes.first_name)"
        :id="`fname-${contact.id}`">
        {{ attributes.first_name }}
      </fluent-button>
      <fluent-button v-if="attributes.middle_name" @click="insertInfo(attributes.middle_name)"
        :id="`mname-${contact.id}`">
        {{ attributes.middle_name }}
      </fluent-button>
      <fluent-button v-if="attributes.last_name" @click="insertInfo(attributes.last_name)" :id="`lname-${contact.id}`">
        {{ attributes.last_name }}
      </fluent-button>
      <fluent-button v-if="attributes.suffix" @click="insertInfo(attributes.suffix_name)" :id="`suffix-${contact.id}`">
        {{ attributes.suffix }}
      </fluent-button>
      <fluent-button v-if="attributes.email" @click="insertInfo(attributes.email)" :id="`email-${contact.id}`">
        {{ attributes.email }}
      </fluent-button>
      <fluent-button v-if="attributes.phone" @click="insertInfo(attributes.phone)" :id="`phone-${contact - id}`">
        {{ attributes.phone }}
      </fluent-button>
      <fluent-button v-if="attributes.address" @click="insertInfo(stripCountry(attributes.address))"
        :id="`address-${contact.id}`">
        {{ stripCountry(attributes.address) }}
      </fluent-button>
      <fluent-button @click="openNewWindow(contactLink)">
        Open in Lawmatics
        <!-- <img src="https://www.lawmatics.com/wp-content/uploads/2024/05/Lawmatics-Logo_FC_Dark.svg" /> -->
      </fluent-button>
    </div>
  </fluent-accordion-item>
</template>

<script setup>
const { contact } = defineProps(['contact'])
const attributes = contact.attributes
const contactLink = computed(() => {
  return `https://app.lawmatics.com/contacts/${contact.id}/details`
})
</script>