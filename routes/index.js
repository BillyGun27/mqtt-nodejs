var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(request, response, next) {
  response.send("hello");
});

router.get('/upload', function(request, response, next) {
  response.sendFile('./public/upload.html');
});


module.exports = router;