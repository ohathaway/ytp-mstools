<template>
  <li class="list-item">
    <div class="grid-container">
      <div class="content-column">
        <div :id="toKebabCase(item.field_label)">
          <strong>{{ item.field_label }}:</strong><br />
          <span class="preview-macro">
            {{ getDisplayMacro(item) }}
          </span>
        </div>
        <fluent-tooltip :anchor="toKebabCase(item.field_label)">
          {{ getDisplayMacro(item) }}
        </fluent-tooltip>
      </div>
      <div class="button-column">
        <fluent-button
          id="insert-button"
          class="icon"
          @click="handleInsert(item)"
          :aria-label="`Add ${item.field_label} to the document`"
        >
          <IconsIconWrapper
            :icon="IconAddSquare"
            width="16"
            height="16"
          />
        </fluent-button>
        <fluent-tooltip anchor="insert-button">
          {{ `Add ${item.field_label} to the document` }}
        </fluent-tooltip>
        <fluent-button
          id="copy-button"
          @click="copyToClipboard(item)"
          :aria-label="item.copyButtonPressed ? 'Copied!' : 'Copy this field to clipboard'"
        >
          <IconsIconWrapper
            :icon="item.copyButtonPressed ? IconCopyOutline : IconCopy"
            class="icon icon-copy"
            width="16"
            height="16"
          />
        </fluent-button>
        <fluent-tooltip
          anchor="copy-button"
        >
          {{ item.copyButtonPressed ? 'Copied!' : 'Copy this field to clipboard' }}
        </fluent-tooltip>
      </div>
    </div>
  </li>
</template>

<script setup>
import IconAddSquare from '@/components/icons/IconAddSquare.vue'
import IconCopy from '@/components/icons/IconCopy.vue'
import IconCopyOutline from '@/components/icons/IconCopyOutline.vue'

const { item, isMruItem } = defineProps({
  item: {
    type: Object,
    required: true
  },
  isMruItem: {
    type: Boolean,
    default: false
  }
})

const store = useLawmaticsFieldsStore()
const { $toast } = useNuxtApp()

const getPreviewMacro = item => {
  const prefix = store.relationshipPrefix
  return item.field_macro.replace(
    /^{\{/, `{{${prefix}${prefix ? '|' : ''}` 
  )
}

const handleInsert = item => {
  const macroToInsert = getPreviewMacro(item)
  insertInfo(macroToInsert)
  store.addToMRU(item)
}

const getDisplayMacro = item => {
  const prefix = store.relationshipPrefix
  return isMruItem && item.fullMacro
    ? item.fullMacro
    : item.field_macro.replace(/^{\{/, `{{${prefix}${prefix ? '|' : ''}`)
}

const copyToClipboard = item => {
  const macroToCopy = getPreviewMacro(item)
  navigator.clipboard.writeText(macroToCopy)
    .then(() => {
      item.copyButtonPressed = ref(true)
      $toast.addToast('Copied to clipboard', 'success')
      setTimeout(() => {
        item.copyButtonPressed = false
      }, 2000)
    })
  store.addToMRU(item)
}
</script>

<style lang="scss" scoped>
.list-item {
  background: #f8f8f8;
  border: 1px solid var(--border-color);
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

.preview-macro {
  font-weight: bold;
  color: #244091;
}
</style>