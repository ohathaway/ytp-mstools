<template>
  <fluent-button
    @click="fixStyles()"
  >
    Apply OHLaw Styles
  </fluent-button>
  <fluent-button
    @click="changeParagraphStyles()"
  >
    Change Paragraph Styles
  </fluent-button>
  <fluent-button
    @click="applyStandards()"
  >
    Apply OHLaw Standards
  </fluent-button>
</template>

<script setup>
// import { ohlawStyles } from './ohlawStyles.js'

const fixStyles = async () => {
  await Word.run(async context => {
    // get all styles in the document
    const styles = context.document.getStyles()
    styles.load('items')
    await context.sync()

    await Promise.all(styles.items.map(async item => {
      // item.load(['font', 'nameLocal', 'linked', 'type', 'paragraphFormat', 'baseStyle'])
      item.load()
      await context.sync()
      if (Object.keys(ohlawStyles).includes(item.nameLocal)) {
        console.info('updating style: ', item.nameLocal)
        console.info('setting style to: ', JSON.stringify(ohlawStyles[item.nameLocal], null, 2))
        // set font
        item.font.set(ohlawStyles[item.nameLocal].font)
        // set paragraph
        item.paragraphFormat.set(ohlawStyles[item.nameLocal].paragraph)
        // console.debug(item.nameLocal, font)
      }
      // await context.sync()
    }))

    await context.sync()
  })
}

const changeParagraphStyles = async () => {
  await Word.run(async context => {
    // change any paragraph following a Heading from Text Heading to body text

    // change 'Text Heading 2' to 'Normal'
    const paragraphs = context.document.body.paragraphs
    await paragraphs.load('items')
    await context.sync()

    await Promise.all(paragraphs.items.map(async item => {
      item.load('style')
      await context.sync()

      if (item.style === 'Text Heading 2') item.style = 'Normal'
      if (item.style === 'Text Heading 3') item.style = 'Body Text First Indent'
      if (item.style === 'Text Heading 4') item.style = 'Body Text First Indent 2'
      await context.sync()
    }))
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

// define styles to update
const ohlawStyles = {
  'Body Text First Indent': {
    font: {},
    list: {},
    paragraph: {
      alignment: 'Justified',
      firstLineIndent: 0,
      keepTogether: true,
      leftIndent: 18,
      lineSpacing: 1.15,
      spaceAfter: 6
    }
  },
  'Body Text First Indent 2': {
    font: {},
    list: {},
    paragraph: {
      alignment: 'Justified',
      firstLineIndent: 0,
      keepTogether: true,
      leftIndent: 36,
      lineSpacing: 1.15,
      spaceAfter: 6
    }
  },
  'Default Paragraph Font': {
    font: {
      name: 'Optima'
    },
    list: {},
    paragraph: {}
  },
  'Document Title': {
    font: {
      bold: true,
      color: '#003399',
      name: 'Trajan Pro',
      size: 18
    },
    list: {},
    paragraph: {
      alignment: 'Centered',
      keepWithNext: true,
      keepTogether: true,
      lineSpacing: 20.0,
      // nextParagraphStyle: 'Normal',
      spaceAfter: 24.0,
      widowControl: true
    }
  },
  'Heading 1': {
    font: {
      bold: true,
      color: '#000000',
      italic: false,
      name: 'Optima',
      size: 16
    },
    list: {},
    paragraph: {
      alignment: "Centered",
      firstLineIndent: 0,
      keepWithNext: true,
      keepTogether: true,
      leftIndent: 0,
      lineSpacing: 20,
      // nextParagraphStyle: 'Normal',
      spaceAfter: 18,
      spaceBefore: 12,
      widowControl: true
    }
  },
  'Heading 2': {
    font: {
      bold: true,
      color: '#000000',
      italic: false,
      name: 'Optima',
      size: 12
    },
    list: {},
    paragraph: {
      firstLineIndent: -90,
      keepWithNext: true,
      keepTogether: true,
      leftIndent: 90,
      lineSpacing: 1,
      // nextParagraphStyle: 'Normal',
      spaceAfter: 6,
      spaceBefore: 18,
      widowControl: true
    }
  },
  'Heading 3': {
    font: {
      bold: true,
      color: '#000000',
      italic: false,
      name: 'Optima',
      size: 12
    },
    list: {},
    paragraph: {
      firstLineIndent: 0,
      keepWithNext: true,
      keepTogether: true,
      leftIndent: 18, // should match that of Body Text First Indent
      lineSpacing: 1,
      // nextParagraphStyle: 'Normal',
      spaceAfter: 6,
      spaceBefore: 12,
      widowControl: true
    }
  },
  'Heading 4': {
    font: {
      bold: true,
      color: '#000000',
      italic: false,
      name: 'Optima',
      size: 12
    },
    list: {},
    paragraph: {
      firstLineIndent: 0,
      keepWithNext: true,
      keepTogether: true,
      leftIndent: 36, // should match that of Body Text First Indent 2
      lineSpacing: 1,
      // nextParagraphStyle: 'Normal',
      spaceAfter: 6,
      spaceBefore: 24,
      widowControl: true
    }
    /*
    },
    'List': {
      font: {},
      list: {},
      paragraph: {
        leftIndet: 18
      }
    */
  },
  'Normal': {
    font: {
      name: 'Optima',
      size: 11
    },
    paragraph: {
      alignment: 'Justified',
      lineSpacing: 1.15,
      spaceAfter: 6,
      spaceBefore: 0
    }
  },
  'Quote': {
    font: {
      bold: false,
      italic: true,
      name: 'Optima'
    },
    list: {},
    paragraph: {
      lineSpacing: 1.15,
      spaceAfter: 6,
      spaceBefore: 0
    }
  },
  'Text Heading 1': {
    font: {
      bold: true,
      name: 'Optima',
      size: 14,
      underline: "Single"
    },
    list: {},
    paragraph: {
      lineSpacing: 1,
      keepWithNext: true,
      keepTogether: true,
      spaceBefore: 18,
      spaceAfter: 0,
      widowControl: true
    }
  },
  'Text Heading 2': {
    font: {
      bold: true,
      name: 'Optima',
      size: 12,
      underline: 'None'
    },
    list: {},
    paragraph: {
      lineSpacing: 1,
      keepWithNext: true,
      keepTogether: true,
      spaceBefore: 12,
      spaceAfter: 6,
      widowControl: true
    }
  },
  'Text Heading 3': {
    font: {
      bold: true,
      name: 'Optima',
      size: 12,
      underline: 'None'
    },
    list: {},
    paragraph: {
      leftIndent: 18
    }
  },
  'Text Heading 4': {
    font: {
      bold: true,
      name: 'Optima',
      size: 12,
      underline: 'None'
    },
    list: {},
    paragraph: {
      leftIndent: 27
    }
  },
  'Portfolio Title': {
    font: {
      name: 'Optima'
    },
    list: {},
    paragraph: {}
  },
  'Portfolio Section': {
    font: {
      name: 'Optima'
    },
    list: {},
    paragraph: {}
  },
  'Title Document': {
    font: {
      name: 'Optima'
    },
    list: {},
    paragraph: {}
  },
  'Document TOC': {
    font: {
      name: 'Optima'
    },
    list: {},
    paragraph: {}
  },
  'Page Number': {
    font: {
      name: 'Optima',
    },
    list: {},
    paragraph: {}
  },
  'TOC 1': {
    font: {
      name: 'Optima'
    },
    list: {},
    paragraph: {}
  },
  'TOC 2': {
    font: {
      name: 'Optima'
    },
    list: {},
    paragraph: {}
  }
}
</script>