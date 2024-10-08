<template>
  <fluent-button @click="removeEmptyParagraphs">
    Remove Empty &para;&para;
  </fluent-button>
</template>

<script setup>
const removeEmptyParagraphs = async () => {
  await Word.run(async context => {
    const paragraphs = context.document.body.paragraphs
    await paragraphs.load('items')
    await context.sync()

    const filteredParas = paragraphs.items.filter(para => {
      console.debug('text: ', para.text.length)
      return para.text.length > 0
    })

    context.document.body.clear()

    filteredParas.map(para => {
      context.document.body.insertParagraph(para.text, 'End')
    })

    await context.sync()
  })
}

const applyStandards = async () => {
  await Word.run(async context => {
    const paragraphs = context.document.body.paragraphs
    await paragraphs.load('items')
    await context.sync()
    // replace all double-spaces: can't be done yet as text cannot be removed

    // replace all trailing spaces: can't be done yet as text cannot be removed

    // add 'keep with next' to paragraphs ending in a colon
    // await connectListIntro(paragraphs, context)

    // replace all empty paragraphs
    await removeEmptyParagraphs(paragraphs, context)


    await context.sync()
  })
}
</script>