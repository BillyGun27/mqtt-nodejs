var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(request, response, next) {
  response.send("hello");
});

router.post('/post', function(request, response, next) {
  response.send(request.body.email);
});

module.exports = router;