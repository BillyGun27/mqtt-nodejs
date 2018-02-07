var express = require('express');
var router = express.Router();
var pool = require("../connectpg");

var query = {
    // give the query a unique name
   // name: 'get_sensor',
    text: 'SELECT * FROM sensor'//,
   // values: [1]
  }
  

/* GET home page. */
router.get('/', function(request, response, next) {
     // callback
     var result;

  pool.query(query, (err, res) => {
    if (err) {
        result = err.stack;
      console.log(err.stack)
    } else {
        result=res;//.rows[0];
      console.log(res)
    }
    response.send(result);   
  })

 
  
});

module.exports = router;