<template>
  <fluent-button
    @click="insertSignatureBlock2()"
  >
    Insert Signature Block 2
  </fluent-button>
  <fluent-button
    @click="insertImage('/img/owen_signature-trans.png')"
  >
    Insert Owen's Signature
  </fluent-button>
  <fluent-button
    @click="insertInfo(juratBase)"
  >
    Insert jurat
  </fluent-button>
  <fluent-button
    @click="insertField('SectionPages')"
  >
    Insert SectionPages
  </fluent-button>
</template>

<script setup>
const juratBase =  `
STATE OF COLORADO	)
	) ss.
COUNTY OF LARIMER	)
This instrument was acknowledged before me on {{current_date_format_a}}, by {{full_name}}.
	[Seal]		
		Owen Hathaway, Notary Public
		My commission expires: November 24, 2028
`

const insertImage = async path => {
  const image = await fetch(path)
  const imageBuffer = await image.arrayBuffer()
  var imageRaw = ''
  var bytes = new Uint8Array(imageBuffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    imageRaw += String.fromCharCode(bytes[i])
  }
  const imageB64 = window.btoa(imageRaw)

  await Word.run(async context => {
    const body = context.document.body

    body.insertInlinePictureFromBase64(imageB64, Word.InsertLocation.start)
    await context.sync()
  })
}

const insertSignatureBlock2 = async () => {
  await Word.run(async context => {
    const range = context.document.getSelection()
    const data = [
      ['', '', '', '', '', '', ''],
      ['Signer 1', '', 'Date', '', 'Signer 2', '', 'Date']
    ]

    // create the table
    const table = range.insertTable(2, 7, 'Before', data)
    table.alignment = 'Centered'

    // const s1SignCell = table.getCell(0, 0)
    // remove all borders
    const tableBorder = table.getBorder('All')
    tableBorder.load(['type', 'width'])
    tableBorder.type = 'None'

    // add bottom border to row 1
    const firstRow = table.rows.getFirst()
    const bottomBorder = firstRow.getBorder('Bottom')
    bottomBorder.type = 'Single'

    // remove borders from spacer cells
    const spacerCells = [1, 3, 5]
    spacerCells.map(column => {
      const cell = table.getCell(0, column)
      const cellBorder = cell.getBorder('Bottom')
      cellBorder.type = 'None'
    })

    await context.sync()
  })

}

const insertXofY = async () => {
  try {
    insertInfo('Page ').then(
      await insertField('Page')
    ).then(
      await insertInfo(' of ')
    ).then(
      await insertField('SectionPages')
    )
  } catch (error) {
    console.error('Failed to insert Page X of Y', error)
    throw error
  }
}
</script>