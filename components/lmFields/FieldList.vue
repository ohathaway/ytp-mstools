<template>
  <div v-if="store.isLoading">Loading fields ...</div>
  <ul v-else class="filtered-list" aria-label="Available fields">
    <li
      v-for="item in store.filteredFields"
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
</template>

<script setup>
import IconAddSquare from '@/components/icons/IconAddSquare.vue'
import IconCopy from '@/components/icons/IconCopy.vue'
import IconCopyOutline from '@/components/icons/IconCopyOutline.vue'

const store = useLawmaticsFieldsStore()
const { $toast } = useNuxtApp()

onMounted(() => {
  store.fetchFields()
})

const getPreviewMacro = item => {
  const prefix = store.relationshipPrefix
  return item.field_macro.replace(
    /^{\{/, `{{${prefix}${prefix ? '|' : ''}` 
  )
}

const handleInsert = item => {
  const macroToInsert = getPreviewMacro(item)
  insertInfo(macroToInsert)
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
}
</script>

<style lang="scss" scoped>
.filtered-list {
  list-style-type: none;
  padding: 0;
  margin-top: 16px;

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
}

.preview-macro {
  font-weight: bold;
  color: #244091;
}
</style>