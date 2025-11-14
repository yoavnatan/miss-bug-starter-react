import fs from 'fs'
import PDFDocument from 'pdfkit'

export const pdfService = {
  buildPDF
}


function buildPDF(bugs, filename = '../downloads/SaveTheBugs.pdf') {

  console.log('hi')

  const Dir = '../downloads'
  if (!fs.existsSync(Dir)) {
    fs.mkdirSync(Dir)
  }

  const doc = new PDFDocument()


  // Pipe its output somewhere, like to a file or HTTP response
  doc.pipe(fs.createWriteStream(filename))

  // iterate bugs array, and create a pdf with all the bugs
  bugs.forEach(bug => {
    // doc.font('./fonts/roboto.ttf')
    doc.text(`Bug ID: ${bug._id}`)
    doc.text(`Title: ${bug.title}`)
    doc.text(`Description: ${bug.description}`)
    doc.text(`Severity: ${bug.severity}`)
    doc.addPage()
  })

  // finalize PDF file
  doc.end()

}
