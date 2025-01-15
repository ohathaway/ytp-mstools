<template>
  <div class="ohl-tab-panel">
    <div class="lm-fields">
      <div class="filter-component">
        <div class="relationship-controls">
          <label for="relationship-selector">Select Relationship Type</label>
          <fluent-select
            id="relationship-selector"
            appearance="outline"
            v-model="currentRelType"
            title="Select a relationship type"
            aria-label="Select a relationship type"
          >
            <fluent-option
              v-for="rel in relationship_types"
              :key="rel.id"
              :value="rel.attributes.name"
            >
              {{ rel.attributes.name }}
            </fluent-option>
          </fluent-select>
          <div class="custom-number-field">
            <input
              type="number"
              v-model="repeatableIndex"
              :disabled="!isCurrentRelTypeRepeatable"
              min="1"
              max="5"
              step="1"
              title="If the relationship is repeatable, select an index (1-5)"
              aria-label="If the relationship is repeatable, select an index (1-5)"
              class="wide-number-field"
            />
          </div>
          <div class="number-controls">
            <button
              @click="incrementIndex"
              :disabled="!isCurrentRelTypeRepeatable || repeatableIndex >= 5"
              title="Increase index"
              aria-label="Increase index"
            >
              ▲
            </button>
            <button
              @click="decrementIndex"
              :disabled="!isCurrentRelTypeRepeatable || repeatableIndex <= 1"
              title="Decrease index"
              aria-label="Decrease index"
            >
              ▼
            </button>
          </div>
        </div>
        <div class="input-wrapper">
          <label>Filter Fields</label>
          <fluent-search
            appearance="outline"
            placeholder="Search for a field..."
            :value="filterText"
            @input="handleSearchInput"
            title="Type to filter available fields"
            aria-label="Type to filter available fields"
          />
        </div>
        <ul class="filtered-list" aria-label="Available fields">
          <li
            v-for="item in filteredItems"
            :key="item.field_label"
            class="list-item"
          >
            <div class="grid-container">
              <div class="content-column">
                <strong>{{ item.field_label }}:</strong><br />
                <span class="preview-macro">
                  {{ getPreviewMacro(item) }}
                </span>
              </div>
              <div class="button-column">
                <fluent-button
                  class="icon"
                  @click="handleInsert(item)"
                  :title="`Add ${item.field_label} to the document`"
                  :aria-label="`Add ${item.field_label} to the document`"
                >
                  <IconsIconWrapper
                    :icon="IconAddSquare"
                    width="16"
                    height="16"
                  />
                </fluent-button>
                <fluent-button
                  @click="copyToClipboard(item)"
                  :title="item.copyButtonPressed ? 'Copied!' : 'Copy this field to clipboard'"
                  :aria-label="item.copyButtonPressed ? 'Copied!' : 'Copy this field to clipboard'"
                >
                  <IconsIconWrapper
                    :icon="item.copyButtonPressed ? IconCopyOutline : IconCopy"
                    class="icon icon-copy"
                    width="16"
                    height="16"
                  />
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
import Fuse from 'fuse.js'
import IconAddSquare from '@/components/icons/IconAddSquare.vue'
import IconCopy from '@/components/icons/IconCopy.vue'
import IconCopyOutline from '@/components/icons/IconCopyOutline.vue'

const { $toast, $searchLm } = useNuxtApp()
const { public: { lmFunction } } = useRuntimeConfig()

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const filterText = ref('')
const currentRelType = ref('Client')
const repeatableIndex = ref(1)
const debouncedFilter = ref(null)
const fuse = ref(null)

onMounted(() => {
  debouncedFilter.value = debounce((value) => {
    filterText.value = value
  }, 300) // 300ms debounce time
})

const relationships = await $searchLm(`${lmFunction}/relationship_types`)
const relationship_types = computed(() => {
  const clientType = { id: 0, attributes: { name: 'Client' }}
  return sortRelationshipTypes([clientType, ...relationships])
})

const sortRelationshipTypes = types => {
  const priorityOrder = [
    'Client',
    'Spouse',
    'Child',
    'Step-child',
    'Grandchild',
    'Owner'
  ]
  
  return types.sort((a, b) => {
    const aName = a.attributes.name
    const bName = b.attributes.name
    const aIndex = priorityOrder.indexOf(a.attributes.name)
    const bIndex = priorityOrder.indexOf(b.attributes.name)

    return (
      aIndex === bIndex
        ? aName.localeCompare(bName)
        : (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex)
    )
  })
}

const handleSearchInput = (event) => {
  debouncedFilter.value(event.target.value)
}

const filteredItems = computed(() => {
  const baseItems = props.items.map(item => ({
    ...item,
    copyButtonPressed: false
  }))

  return filterText.value
    ? fuse.value.search(filterText.value).map(result => ({
      ...result.item,
      copyButtonPressed: false
    }))
    : baseItems
})

const incrementIndex = () => {
  if (repeatableIndex.value < 5) {
    repeatableIndex.value++
  }
}

const decrementIndex = () => {
  if (repeatableIndex.value > 1) {
    repeatableIndex.value--
  }
}

const isCurrentRelTypeRepeatable = computed(() => {
  const currentRel = relationships.find(
    rel => rel.attributes.name === currentRelType.value
  )
  return Boolean(currentRel?.attributes.is_repeatable)
})

const getRelationshipPrefix = computed(() => {
  const currentRel = relationships.find(
    rel => rel.attributes.name === currentRelType.value
  )
  const relTypePrefix = currentRelType.value === 'Client'
    ? ''
    : `rel_${currentRelType.value.toLowerCase()}`
  const indexSuffix = currentRel?.attributes.is_repeatable
    ? `_${repeatableIndex.value}`
    : ''
  return `${relTypePrefix}${indexSuffix}`
})

const getPreviewMacro = item => {
  const prefix = getRelationshipPrefix.value
  return item.field_macro.replace(
    /^\{\{/, `{{${prefix}${prefix ? '|' : ''}`
  )
}

const handleInsert = (item) => {
  const prefix = getRelationshipPrefix()
  const macroToInsert = item.field_macro.replace(
    /^\{\{/, `{{${prefix}${prefix ? '|' : ''}`
  )

  insertInfo(macroToInsert)
}

const copyToClipboard = item => {
  const prefix = getRelationshipPrefix()
  console.debug('prefix: ', prefix)
  const macroToCopy = item.field_macro.replace(
    /^\{\{/, `{{${prefix}${prefix ? '|' : ''}`
  )
  console.debug('macroToCopy: ', macroToCopy)
  navigator.clipboard.writeText(macroToCopy)
    .then(() => {
      item.copyButtonPressed = true
      $toast.addToast('Copied to clipboard', 'success')
      setTimeout(() => {
        item.copyButtonPressed = false
      }, 2000)
    })
    .catch(err => {
      console.error('Failed to copy text: ', err)
      $toast.addToast('Failed to copy text', 'error')
    })
}

watchEffect(() => {
  fuse.value = new Fuse(props.items, {
    keys: ['field_label', 'field_macro'],
    threshold: 0.4,
    includeScore: true
  })
})

watchEffect(() => {
  // This will run whenever currentRelType, repeatableIndex, or filterText changes
  const filtered = props.items.filter(item => 
    item.field_label.toLowerCase().includes(filterText.value.toLowerCase()) ||
    item.field_macro.toLowerCase().includes(filterText.value.toLowerCase())
  )
  filteredItems.value = filtered.map(item => ({
    ...item,
    previewMacro: getPreviewMacro(item)
  }))
})
</script>

<style lang="scss" scoped>
$border-color: #d1d1d1;
$hover-color: #e1e1e1;
$active-color: #d1d1d1;
$disabled-opacity: 0.5;
$field-height: 20;
$button-background-color: #f3f3f3;

.ohl-tab-panel {
  width: 290px;
}

.lm-fields {
  display: inline-grid;
  gap: 15px;
}

label {
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
}

.relationship-controls {
  display: flex;
  gap: 10px;
  align-items: stretch;
  margin: 8px 0;
}

fluent-search {
  width: 100%;
}
// ::v-deep(fluent-select) {
fluent-select {
  min-width: 0;
  flex: 4;
}

.custom-number-field {
  flex: 1;
  display: flex;
  align-items: stretch;
  border: 0.8px solid $border-color;
  border-radius: 4px;
  height: $field-height;
  overflow: hidden;
}

.custom-number-field input {
  flex: 1;
  width: 20px;
  border: none;
  padding: 4px 8px;
  text-align: center;
  appearance: textfield;
  -moz-appearance: textfield;
  font-size: 14px;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

.number-controls {
  display: flex;
  flex-direction: column;
  width: 20px;
}

.number-controls button {
  flex: 1;
  border: none;
  background-color: $button-background-color;
  cursor: pointer;
  padding: 0;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 !important;
  height: 45%;

  &:first-child {
    border-bottom: 1px solid $border-color;
  }
  &:hover {
    background-color: $hover-color;
  }

  &:active {
    background-color: $active-color;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: $disabled-opacity;
  }
}

.icon {
  color: #244091;
}

.filtered-list {
  list-style-type: none;
  padding: 0;
  margin-top: 16px;

  .list-item {
    background: #f8f8f8;
    border: 1px solid $border-color;
    padding: 8px;
    margin-bottom: 8px;
    border-radius: 4px;

    .grid-container {
      display: grid;
      grid-template-columns: 9fr 3fr;
      gap: 8px;

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
    }
  }
}

.preview-macro {
  font-weight: bold;
  color: #244091;
}
</style>