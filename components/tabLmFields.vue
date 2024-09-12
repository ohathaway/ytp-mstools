<template>
  <div class="ohl-tab-panel">
    <div class="lm-data">
      <div class="filter-component">
        <div class="input-wrapper">
          <fluent-search
            appearance="outline"
            placeholder="Filter fields..."
            v-model="filterText"
            @input="updateFilter"
          />
          <button
            v-if="filterText"
            @click="clearFilter"
            class="clear-button"
          >
            &#x2715;
          </button>
        </div>
        <div class="relationship-controls">
          <fluent-select
            v-model="currentRelType"
            title="Select a relationship"
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
              title="Select index"
              class="wide-number-field"
            />
          </div>
          <div class="number-controls">
            <button @click="incrementIndex" :disabled="!isCurrentRelTypeRepeatable || repeatableIndex >= 5">▲</button>
            <button @click="decrementIndex" :disabled="!isCurrentRelTypeRepeatable || repeatableIndex <= 1">▼</button>
          </div>
        </div>
        <ul class="filtered-list">
          <li v-for="item in filteredItems" :key="item.field_label" class="list-item">
            <div class="grid-container">
              <div class="content-column">
                <strong>{{ item.field_label }}:</strong><br />{{ item.field_macro }}
              </div>
              <div class="button-column">
                <fluent-button class="icon" @click="handleInsert(item)">
                  <IconsIconWrapper
                    :icon="IconAddSquare"
                    width="16"
                    height="16"
                  />
                </fluent-button>
                <fluent-button @click="copyToClipboard(item)">
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
import { ref, computed } from 'vue'
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

const relationships = await $searchLm(`${lmFunction}/relationship_types`)
const relationship_types = computed(() => [
  { id: 0, attributes: { name: 'Client' }},
  ...relationships
])

const isCurrentRelTypeRepeatable = computed(() => {
  const currentRel = relationships.find(rel => rel.attributes.name === currentRelType.value)
  return Boolean(currentRel?.attributes.is_repeatable)
})

const filteredItems = computed(() => {
  const searchTerm = filterText.value.toLowerCase()
  return props.items.map(item => ({
    ...item,
    copyButtonPressed: false
  })).filter(item => 
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

const handleInsert = (item) => {
  const currentRel = relationships.data.find(
    rel => rel.attributes.name === currentRelType.value
  )
  const relTypePrefix = currentRelType.value === 'Client'
    ? ''
    : `rel_${currentRelType.value.toLowerCase()}`
  const indexSuffix = currentRel?.attributes.is_repeatable
    ? `_${repeatableIndex.value}`
    : ''
  const macroToInsert = item.field_macro.replace(
    /^\{\{/, `{{${relTypePrefix}${indexSuffix}|`
  )

  insertInfo(macroToInsert)
}

const copyToClipboard = item => {
  navigator.clipboard.writeText(item.field_macro)
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
</script>

<style lang="scss" scoped>
$border-color: #d1d1d1;
$hover-color: #e1e1e1;
$active-color: #d1d1d1;
$disabled-opacity: 0.5;
$field-height: 32px;
$button-background-color: #f3f3f3;

.ohl-tab-panel {
  width: 290px;
}

.lm-data {
  display: inline-grid;
  gap: 15px;
}

.relationship-controls {
  display: flex;
  gap: 10px;
  align-items: stretch;
}

::v-deep(fluent-select) {
  flex: 2;
  height: $field-height;
}

.custom-number-field {
  flex: 1;
  display: flex;
  align-items: stretch;
  border: 1px solid $border-color;
  border-radius: 2px;
  height: $field-height;
  overflow: hidden;
}

.custom-number-field input {
  flex: 1;
  width: 20px;
  border: none;
  padding: 4px 8px;
  text-align: center;
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

.input-wrapper {
  position: relative;

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
}

.icon {
  color: #244091;
}

.filtered-list {
  list-style-type: none;
  padding: 0;
  margin-top: 16px;

  .list-item {
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
</style>