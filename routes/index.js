var express = require('express');
var router = express.Router();
var reader = require("../decklist/Reader")

/* GET home page. */
router.get('/', function(req, res, next) {
  reader.processDeckList("decklist.txt");
  console.log(reader.pokemonNameOutput)

  res.render('index', { title: 'Express' });
});

module.exports = router;
