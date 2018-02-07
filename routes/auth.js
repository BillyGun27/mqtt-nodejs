var express = require('express');
var router = express.Router();

var pool = require("../connectpg");



/* GET home page. */
router.get('/', function(request, response, next) {
  response.send("hello");
});

router.post('/register', function(request, response, next) {
  var query = {
    // give the query a unique name
   // name: 'get_sensor',
    text: 'INSERT * INTO sensor (email,password) VALUES ($1, $2) ',
    values: [request.body.email,request.body.password]
  }

  pool.query(query, (err, res) => {
      if (err) {
          result = err.stack;
        console.log(err.stack)
      } else {
          if(res.rowCount){
              result=true;//.rows[0];
          }else{
              result = false;
          }
          
        console.log(res)
      }
      response.send(result);   
    })

});

router.post('/login', function(request, response, next) {
    var query = {
        // give the query a unique name
       // name: 'get_sensor',
        text: 'SELECT * FROM user_account WHERE email=$1 AND password=$2 ',
        values: [request.body.email,request.body.password]
      }

    pool.query(query, (err, res) => {
        if (err) {
            result = err.stack;
          console.log(err.stack)
        } else {
            if(res.rowCount){
                result=true;//.rows[0];
            }else{
                result = false;
            }
            
          console.log(res)
        }
        response.send(result);   
      })

  });



module.exports = router;