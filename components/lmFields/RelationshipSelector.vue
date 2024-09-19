<template>
  <div class="relationship-controls">
    <!-- <label>Relationship</label> -->
    <fluent-select
      id="relationship-selector"
      appearance="outline"
      v-model="store.currentRelType"
      title="Select a relationship type"
      aria-label="Select a relationship type"
    >
      <fluent-option
        v-for="rel in store.sortedRelationshipTypes"
        :key="rel.id"
        :value="rel.attributes.name"
      >
        {{ rel.attributes.name }}
      </fluent-option>
    </fluent-select>
    <div class="custom-number-field">
      <input
        type="number"
        v-model="store.repeatableIndex"
        :disabled="!store.isCurrentRelTypeRepeatable"
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
        :disabled="!canIncrementIndex"
        title="Increase index"
        aria-label="Increase index"
      >
        ▲
      </button>
      <button
        @click="decrementIndex"
        :disabled="!canDecrementIndex"
        title="Decrease index"
        aria-label="Decrease index"
      >
        ▼
      </button>
    </div>
  </div>
</template>

<script setup>
const store = useLawmaticsFieldsStore()

const canIncrementIndex = computed(() => 
store.isCurrentRelTypeRepeatable && store.repeatableIndex < 5
)

const canDecrementIndex = computed(() =>
store.isCurrentRelTypeRepeatable && store.repeatableIndex > 1
)

const incrementIndex = () => {
  store.repeatableIndex = Math.min(store.repeatableIndex + 1, 5)
}

const decrementIndex = () => {
  store.repeatableIndex = Math.max(store.repeatableIndex -1, 1)
}
</script>

<style lang="scss" scoped>
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

fluent-select {
  min-width: 0;
  flex: 4;
}

.custom-number-field {
  flex: 1;
  display: flex;
  align-items: stretch;
  border: 0.8px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.custom-number-field input {
  flex: 1;
  width: 20px;
  height: 20px;
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
  background-color: var(--button-background-color);
  cursor: pointer;
  padding: 0;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 !important;
  height: 45%;

  &:first-child {
    border-bottom: 1px solid var(--border-color);
  }
  &:hover {
    background-color: var(--hover-color);
  }

  &:active {
    background-color: var(--active-color);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: var(--disabled-opacity);
  }
}
</style>