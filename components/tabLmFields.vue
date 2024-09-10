<template>
  <div class="ohl-tab-panel">
    <div class="lmLogin" v-if="!isLmAuthenticated">
      <fluent-button>
        Log In to Lawmatics
      </fluent-button>
    </div>
    <div class="lm-data" v-else>
      <div class="filter-component">
        <div class="input-wrapper">
          <fluent-search
            appearance="outline"
            placeholder="Filter fields..."
            v-model="filterText"
            @input="updateFilter"
            @keyup="handleKeyUp"
          />
          <button
            v-if="filterText"
            @click="clearFilter"
            class="clear-button"
          >
            &#x2715;
          </button>
        </div>
        <ul class="filtered-list">
          <li v-for="item in filteredItems" :key="item.field_label" class="list-item">
            <div class="grid-container">
              <div class="content-column">
                <strong>{{ item.field_label }}:</strong><br />{{ item.field_macro }}
              </div>
              <div class="button-column">
                <fluent-button @click="insertInfo(item.field_macro)">
                  <IconsIconWrapper :icon="IconAddSquare" />
                </fluent-button>
                <fluent-button @click="copyToClipboard(item.field_macro)">
                  <IconsIconWrapper v-if="copyButtonPressed" :icon="IconCopyOutline" />
                  <IconsIconWrapper v-else :icon="IconCopy" />
                </fluent-button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconAddSquare from '@/components/icons/IconAddSquare.vue'
import IconCopy from '@/components/icons/IconCopy.vue'
import IconCopyOutline from '@/components/icons/IconCopyOutline.vue'

const { $toast } = useNuxtApp()
// Replace with actual authentication logic
const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const isLmAuthenticated = computed(() => true)

const filterText = ref('')
const copyButtonPressed = ref(false)

const filteredItems = computed(() => {
  const searchTerm = filterText.value.toLowerCase()
  return props.items.filter(item => 
    item.field_label.toLowerCase().includes(searchTerm) ||
    item.field_macro.toLowerCase().includes(searchTerm)
  )
})

const updateFilter = event => {
  filterText.value = event.target.value
}

const clearFilter = () => {
  filterText.value = ''
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    copyButtonPressed.value = true
    $toast.addToast('Copied to clipboard', 'success')
    setTimeout(() => {
      copyButtonPressed.value = false
    }, 2000)
  }).catch(err => {
    console.error('Failed to copy text: ', err)
    $toast.addToast('Failed to copy text', 'error')
  })
}
</script>

<style scoped>
.ohl-tab-panel {
  width: 290px;
}

.lm-data {
  display: inline-grid;
  gap: 15px;
}

.input-wrapper {
  position: relative;
}

.filter-input {
  width: 100%;
  padding: 8px 30px 8px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.clear-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #888;
}

.filtered-list {
  list-style-type: none;
  padding: 0;
  margin-top: 16px;
}

.list-item {
  border: 1px solid #ddd;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
}

.grid-container {
  display: grid;
  grid-template-columns: 9fr 3fr;
  gap: 8px;
}

.content-column {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.button-column {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>