var express = require('express');
const path = require('path');
var mv = require('mv');
var router = express.Router();
var pool = require("../connectpg");

var fs = require('fs');
  

/* GET home page. */
router.get('/', function(request, response, next) {
     
    
    response.send("hello");   

});

/* GET home page. */
router.get('/sensor', function(request, response, next) {
  // callback
  var result;
  var query = {
    text: 'SELECT * FROM sensor'
  }
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

/* GET home page. */
router.get('/mesin', function(request, response, next) {
  // callback
  var result;
  var query = {
    text: 'SELECT * FROM mesin'//,
  }
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

var node_xj = require("xlsx-to-json-lc");
router.get('/xls', function(request, response, next) {
  // callback
  var data;
  
  node_xj({
    input: path.join( __dirname  ,'../xls/'+ "sample_data.xls"),  // input xls 
    output: null, // output json 
    lowerCaseHeaders:true
  }, function(err, result) {
    if(err) {
      data = err;
      console.error(err);
    } else {
      data = result;
      console.log(result);
    }

    response.send(data);  
  });

 



});


module.exports = router;