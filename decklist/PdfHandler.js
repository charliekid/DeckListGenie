const fs = require('fs');
var reader = require("../decklist/Reader")
var PdfLib = require('pdf-lib');
var PDFDocument = PdfLib.PDFDocument;
var StandardFonts = PdfLib.StandardFonts;
var rgb = PdfLib.rgb;
const log4js = require("log4js");
const logger = log4js.getLogger("PdfHandler");

let x_qty = 283;
let x_name = 310;
let x_set = 475;
let x_collectionNum = 522;

let y_pokemon = 214;
let y_trainer = 390;
let y_energy = 671;

let x_player_name = 100;
let x_player_id = 290;
let x_dob_month = 505;
let x_dob_day = 535;
let x_dob_year = 557;
let x_age_division = 384;

let y_junior = 126;
let y_senior = 140;
let y_master = 154;
let y_player_info = 88;


async function main(name, playerId, dob, division) {
  // reader.processDeckList("./submittedList.txt");
  try {
    reader.processDeckList("./submittedList.txt");
    // create a copy of the decklist.pdf
    console.log("copying decklist pdf")
    fs.copyFile("decklist.pdf", "decklist-copy.pdf", (err) => {
      if(err) {
        logger.error(err);
        console.log(`[PdfHandler.js ]ERROR ${err}`);
      }
    })
    console.log("finished copying decklist pdf")
    // logger.info(reader.pokemonNameOutput)
    // This should be a Uint8Array or ArrayBuffer
// This data can be obtained in a number of different ways
// If your running in a Node environment, you could use fs.readFile()
// In the browser, you could make a fetch() call and use res.arrayBuffer()
    const existingPdfBytes = fs.readFileSync("decklist-copy.pdf");

// Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

// Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // Get the first page of the document
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

// Get the width and height of the first page
    const {width, height} = firstPage.getSize();

    writeOnPage(firstPage, reader.getPokemonQty(), x_qty, y_pokemon, height, helveticaFont);
    writeOnPage(firstPage, reader.getPokemonNames(), x_name, y_pokemon, height, helveticaFont);
    writeOnPage(firstPage, reader.getPokemonSet(), x_set, y_pokemon, height, helveticaFont);
    writeOnPage(firstPage, reader.getPokemonCollection(), x_collectionNum, y_pokemon, height, helveticaFont);

    writeOnPage(firstPage, reader.getTrainerQty(), x_qty, y_trainer, height, helveticaFont);
    writeOnPage(firstPage, reader.getTrainerNames(), x_name, y_trainer, height, helveticaFont);

    writeOnPage(firstPage, reader.getEnergyQty(), x_qty, y_energy, height, helveticaFont);
    writeOnPage(firstPage, reader.getEnergyName(), x_name, y_energy, height, helveticaFont);

    // name and stuff
    writeOnPage(firstPage, name, x_player_name, y_player_info, height, helveticaFont);
    writeOnPage(firstPage, playerId, x_player_id, y_player_info, height, helveticaFont);

    let splitDob = dob.split("/");
    writeOnPage(firstPage, splitDob[0], x_dob_month, y_player_info, height, helveticaFont);
    writeOnPage(firstPage, splitDob[1], x_dob_day, y_player_info, height, helveticaFont);
    writeOnPage(firstPage, splitDob[2], x_dob_year, y_player_info, height, helveticaFont);

    if (division === "Junior") {
      writeOnPage(firstPage, "X", x_age_division, y_junior, height, helveticaFont);
    } else if (division === "Senior") {
      writeOnPage(firstPage, "X", x_age_division, y_senior, height, helveticaFont);
    } else if (division === "Masters") {
      writeOnPage(firstPage, "X", x_age_division, y_master, height, helveticaFont);
    } else {
      // log error
    }


    const pdfBytes = await pdfDoc.save()

    const filePath = `${__dirname}/../public/modified.pdf`;
    fs.writeFileSync(filePath, pdfBytes);
    logger.info(`PDF file written `);
  }
  catch(e) {
    logger.info("Error: Something is wrong with your decklist submission");
    console.log(e);
  }
}

/**
 *
 * @param page - from the pdf-lib
 * @param text - we want to have on written
 * @param x - start
 * @param y -
 */
function writeOnPage(page, text, x, y, height, helveticaFont) {
  page.drawText(text, {
    x: x,
    y: height - y,
    lineHeight: 10,
    size: 10,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  })

}

module.exports = {main}