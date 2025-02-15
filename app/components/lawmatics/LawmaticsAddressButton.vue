<template>
  <v-btn
    v-if="addresses.length > 0"
    v-for="address in addresses"
    :key="address.id"
    class="text-none"
    rounded="sm"
    density="comfortable"
    variant="tonal"
  >
    {{ address.label }} Address
    <v-menu
      :id="`address-menu-${address.id}`"
      activator="parent"
    >
      <v-list>
        <v-list-item @click="insertInfo(stripCountry(joinParts(address.parts)))">
          {{ stripCountry(joinParts(address.parts)) }}
        </v-list-item>
        <v-list-item
          v-for="part in address.parts"
          :key="part.label"
          @click="insertInfo(part.value)"
        >
          <v-list-item-title>&nbsp;&nbsp;{{ part.label }}: {{  part.value }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup>
const { $getLmObject } = useNuxtApp()

const { addressIds, contactId } = defineProps({
  addressIds: {
    type: Array,
    required: true
  },
  contactId: {
    type: [String, Number],
    required: true
  }
})

const { toastError } = useToastStore()

const addresses = ref([])

const transformAddress = (response) => {
  const { id } = response
  const { label, ...addressParts } = response.attributes

  const parts = Object.entries(addressParts)
    .filter(([_, value]) => value !== null && value !== '')
    .map(([label, value]) => ({ label, value }))
    
  return { id, label, parts }
}

const fetchAddresses = async () => {
  try {
    const responses = await Promise.all(
      addressIds.map(id => $getLmObject(id, 'addresses'))
    )
    console.debug('fetch address responses: ', responses)
    addresses.value = responses.map(transformAddress)
  } catch (error) {
    console.error('error fetching addresses: ', error)
    toastError(`Error fetching addresses:
    ${error}`)
  }
}

const joinParts = parts => {
  return parts.map((part, index, array) => {
    const isLast = index === array.length - 1
    const isState = part.label === 'state'
    return part.value + (!isLast && !isState ? ', ' : ' ')
  }).join('').trim()
}

// Use watchEffect to handle the async operation
watchEffect(async () => {
  if (addressIds.length > 0) {
    await fetchAddresses()
  }
})

const getAddressParts = address => {
  console.debug('calling getAddressParts() with: ', address)
  return Object.keys(address.attributes).filter(key => address.attributes[key])
  // const keys = Object.keys(address.attributes)
  // console.debug('keys: ', keys)
  // return Object.keys(address.attributes)
}
/*
const insertFormattedDate = format => {
  const formattedDate = dayjs(props.birthdate).format(format)
  insertInfo(formattedDate)
}
*/
</script>

<style scoped>
.address-field {
  position: relative;
  display: inline-block;
}

fluent-menu {
  position: absolute;
  z-index: 1000;
}
</style>