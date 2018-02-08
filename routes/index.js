var express = require('express');
var router = express.Router();

var moment = require('moment');
//moment().format();

/* GET home page. */
router.get('/', function(request, response, next) {
  
console.log(moment.locale());         // en
console.log(moment().format('LT'));   // 11:34 AM
  response.send(moment().format('LT'));
});

router.get('/upload', function(request, response, next) {
  response.sendFile('./public/upload.html');
});


module.exports = router;