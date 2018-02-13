var express = require('express');
const path = require('path');
var mv = require('mv');
var router = express.Router();
var pool = require("../connectpg");

var fs = require('fs');
  

/* GET home page. */
router.get('/', function(request, response, next) {
     
    
    response.send(request.headers);   

});

/* GET home page. */
router.post('/sensor', function(request, response, next) {
  // callback
  var result;
  var query = {
    text: 'SELECT * FROM sensor WHERE receive_date BETWEEN $1 AND $2 ',
    values: [ request.query.min ,request.query.max ]
  }
pool.query(query, (err, res) => {
 if (err) {
     result = err.stack;
   console.log(err.stack)
 } else {
     result=res.rows;//.rows[0];
   console.log(res)
 }
 response.send(result); 
 //console.log(request);  
})



});

/**
 * SELECT x1.id, x1.date, DATEDIFF(mi, x2.date, x1.date)
FROM x AS x1 LEFT JOIN x AS x2
ON x1.id = x2.id +1 
 */

/* GET home page. */
router.get('/mesin', function(request, response, next) {
  // callback
  var result;
  var query = {
    text: "SELECT x1.status_mesin AS status_awal, x2.status_mesin AS status_akhir ,(x2.receive_time - x1.receive_time) AS diff FROM public.mesin AS x1 ,public.mesin AS x2 WHERE x1.id +1 = x2.id "//,
  }
pool.query(query, (err, res) => {
 if (err) {
     result = err.stack;
   console.log(err.stack)
 } else {
     result=res.rows;//.rows[0];
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
var jsonQuery = require('json-query');

router.post('/xls', function(request, response, next) {
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
    /**
     * var data = {
  people: [
    {name: 'Matt', country: 'NZ'},
    {name: 'Pete', country: 'AU'},
    {name: 'Mikey', country: 'NZ'}
  ]
}
     */
//"date":"12/21/17"dat =
datmin = request.body.min; 
datmax = request.body.max;
    var output= jsonQuery('[* date>='+datmin+' & date<='+datmax+']', {
      data: data
    }).value

    response.send(output);  
  });

 



});


module.exports = router;