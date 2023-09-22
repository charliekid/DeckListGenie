const fs = require('fs');

var express = require('express');
var router = express.Router();
var reader = require("../decklist/Reader")
var pdfHandler = require('../decklist/PdfHandler');

const {getLogger} = require("log4js");
const logger = getLogger("index.js");

/* GET home page. */
router.get('/', async function (req, res, next) {
  // await pdfHandler.main("Name", "IDDDDD", "20/32/2322", "Junior");
  res.render('index', {title: 'Express'});
});


router.post('/submit', async function (req, res, next) {
  //save decklist to txt
  try {
    let fileName = 'submittedList.txt';
    // console.log(req.body.name);
    fs.writeFile(fileName, req.body.decklist, async (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log(`Text has been written to ${fileName}`);
        await pdfHandler.main(req.body.name, req.body.playerId, req.body.dob, req.body.division );
        res.json({
          successful : true
        })
      }
    });
  } catch (e) {

  }
});

module.exports = router;
