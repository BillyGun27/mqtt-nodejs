var express = require('express');
const path = require('path');
var router = express.Router();


//moment().format();

/* GET home page. */
/*router.get('/', function(request, response, next) {
  response.send(ind.format('l') +"clock"+ ind.format('HH:mm:ss'));
});*/

router.get('/upload', function(request, response, next) {
  response.sendFile(path.join( __dirname  ,'../public/upload.html'));
});


module.exports = router;