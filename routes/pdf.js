const express = require('express');
const pdfService = require('../public/pdf_service');

const pdfRouter = express.Router();

pdfRouter.get('/pdf', (req, res, next) => {
  pdfService.buildPDF(res);
});

module.exports = pdfRouter;
