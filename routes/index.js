const fs = require('fs');

var express = require('express');
var router = express.Router();
var reader = require("../decklist/Reader")
// import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
var PdfLib = require('pdf-lib');
var PDFDocument = PdfLib.PDFDocument;
var StandardFonts = PdfLib.StandardFonts;
var rgb = PdfLib.rgb;


let x_qty = 283;
let x_name = 310.14;
let x_set = 646.40;
let x_collectionNum = 695.43;

let y_pokemon = 213.75;
let y_trainer = 511.98;
let y_energy = 887.17;

/* GET home page. */
router.get('/', async function (req, res, next) {
  reader.processDeckList("decklist.txt");
  // console.log(reader.pokemonNameOutput)
  // This should be a Uint8Array or ArrayBuffer
// This data can be obtained in a number of different ways
// If your running in a Node environment, you could use fs.readFile()
// In the browser, you could make a fetch() call and use res.arrayBuffer()
  const existingPdfBytes = fs.readFileSync("decklist.pdf");

// Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes)

// Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // Get the first page of the document
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]

// Get the width and height of the first page
  const { width, height } = firstPage.getSize();
  // console.log(`width : ${width} height : ${height}`);
  // firstPage.drawText('This text was added with JavaScript!', {
  //   x: 5,
  //   y: height / 2 + 300,
  //   size: 50,
  //   font: helveticaFont,
  //   color: rgb(0.95, 0.1, 0.1),
  // })
  //
  firstPage.drawText(reader.getPokemonQty(), {
    x: x_qty,
    y: height - y_pokemon,
    lineHeight: 10,
    size: 10,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  })
  console.log(reader.getPokemonNames());
  firstPage.drawText(reader.getPokemonNames(), {
    x: x_name,
    y: height - y_pokemon,
    lineHeight: 10,
    size: 10,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  })

  const pdfBytes = await pdfDoc.save()

  const filePath = `${__dirname}/modified.pdf`;
  fs.writeFileSync(filePath, pdfBytes);
  console.log(`PDF file written to: ${filePath}`);

  res.render('index', {title: 'Express'});
});

module.exports = router;
