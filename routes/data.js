var express = require('express');
const path = require('path');
var router = express.Router();
var pool = require("../connectpg");

var fs = require('fs');

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
var mv = require('mv');


router.post('/upload', function(request, response, next) {
  // callback
console.log(JSON.stringify(request.files) );
var file = request.files.thumbnail;
//var ext = str.split(".");
oldpath = file.path;
newpath = path.join( __dirname  ,'../xls/'+ "sample_data.xls");
mv(oldpath, newpath, function(err) {
  // done. it tried fs.rename first, and then falls back to
  // piping the source file to the dest file and then unlinking
  // the source file.
});
response.send(newpath);
});


module.exports = router;