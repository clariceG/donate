const PDFDocument = require('pdfkit');

function buildPDF(res) {
  const doc = new PDFDocument();

  // Set up the response header for PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment;filename=Report.pdf');

  // Pipe the PDF content directly to the response
  doc.pipe(res);

  // Embed a font, set the font size, and render some text
  doc.fontSize(25);
  doc.text('Some text with an embedded font!', 100, 100);

  // End the PDF generation
  doc.end();
}

module.exports = { buildPDF };
