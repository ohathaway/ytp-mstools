<template>
  <div class="spacing-control">
    <fluent-number-field v-model.number="beforeSpace" step="6" min="0"></fluent-number-field>
    <fluent-button
      class="apply-button"
      @click="setParaSpace('before', beforeSpace)"
    >
      Set Before Space
    </fluent-button>
    <fluent-button
      class="reset-button"
      @click="beforeSpace = beforeDefault"
    >
      Reset
    </fluent-button>
  </div>
  <div class="spacing-control">
    <fluent-number-field v-model.number="afterSpace" step="6" min="0"></fluent-number-field>
    <fluent-button
      class="apply-button"
      @click="setParaSpace('after', afterSpace)"
    >
      Set After Space
    </fluent-button>
    <fluent-button
      class="reset-button"
      @click="afterSpace = afterDefault"
    >
      Reset
    </fluent-button>
  </div>
  <div class="spacing-control">
    <fluent-button
      @click="setFont('Optima')"
    >
      <span class="optima">Set Optima</span>
    </fluent-button>
    <fluent-button
      @click="setFont('Trajan Pro')"
    >
      <span class="trajan">Set Trajan</span>
    </fluent-button>
  </div>
</template>

<script setup>
const beforeDefault = 0
const afterDefault = 6
const beforeSpace = ref(beforeDefault)
const afterSpace = ref(afterDefault)

const setParaSpace = async (position, space) => {
  const prop = position === 'before' ? 'spaceBefore' : 'spaceAfter'
  const setting = { [prop]: space }
  console.debug('setting: ', setting)
   
  await Word.run(async context => {
    const doc = context.document
    const range = doc.getSelection()
    range.paragraphs.load('items')
    await context.sync()
    range.paragraphs.items.forEach(para => {
      para.set(setting)
    })

    await context.sync()
  })
}

const setFont = async fontName => {
  await Word.run(async context => {
    const doc = context.document
    const range = doc.getSelection()
    range.set({ font: { name: fontName } })

    await context.sync()
  })
}
</script>

<style>
.spacing-control {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  fluent-number-field {
    width: 25%;
  }
  .apply-button {
    cursor: pointer;
    margin-left: 10px;
    width: 50%;
  }
  .reset-button {
    cursor: pointer;
    margin-left: 10px;
    width: 25%;
  }
}
</style>