<template>
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
</template>

<script setup>

const setFont = async fontName => {
  await Word.run(async context => {
    const doc = context.document
    const range = doc.getSelection()
    range.set({ font: { name: fontName } })

    await context.sync()
  })
}
</script>