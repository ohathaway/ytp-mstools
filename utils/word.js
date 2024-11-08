export const insertInfo = async info => {
  await Word.run(async context => {
    const range = context.document.getSelection()
    console.debug('retrieved document range: ', range)
    range.insertText(info, 'Before')

    await context.sync()
  })
}

export const replaceDoubleSpacesWithSingleSpace = async () => {
  await Word.run(async (context) => {
    // Get all paragraphs in the body of the document
    const paragraphs = context.document.body.paragraphs
    paragraphs.load('items')
    
    // Sync to load the paragraphs
    await context.sync()
    
    // Define the pattern to find double spaces
    const doubleSpacePattern = / {2,}/g  // Regex to match double spaces (and more)
    
    // Loop through each paragraph
    paragraphs.items.forEach(paragraph => {
      let paragraphText = paragraph.text
      
      // Finad all occurrences of a double space
      const matches = [...paragraphText.matchAll(doubleSpacePattern)]
      console.debug('all matches: ', matches)

      // Map each match to a range object
      const ranges = matches.map(match => {
        const matchStart = match.index
        const matchLength = match[0].matchLength
        
        console.debug('running getRange()')
        return paragraph.getRange('Start')
          .expandTo(matchStart) 
      })

      ranges.forEach(range => {
        console.debug('running insertText()')
        range.insertText(' ', 'Replace')
      })
  })

  // Sync the document to reflect changes
  await context.sync()
  })
}
