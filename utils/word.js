export const insertInfo = async info => {
  await Word.run(async context => {
    const range = context.document.getSelection()
    console.debug('retrieved document range: ', range)
    range.insertText(info, 'Before')

    await context.sync()
  })
}