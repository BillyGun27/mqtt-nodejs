const express = require('express');
var path = require('path');
const formidable = require('express-formidable');
const mqtt = require('mqtt');
const bodyParser = require('body-parser');

const client  = mqtt.connect('mqtt://iot.eclipse.org');//mqtt://127.0.0.1

const pool = require("./connectpg");

 
client.on('connect', function () {
  client.subscribe('sensory')
  client.publish('sensory', '{ "value" : "100"}')
})
 
var msg
client.on('message', function (topic, message) {
  // message is Buffer
 // console.log(message.toString())
 // msg = message.toString()
 var data = JSON.parse(message.toString());
  console.log(data.value);
  msg = message.toString()
/*
query = {
    // give the query a unique name
    name: 'subscribeMQTT',
    text: 'INSERT INTO sensor (do_value ,receive_date) VALUES ($1 ,CURRENT_TIMESTAMP) ',
    values: [data.value]
  }

  // callback
pool.query(query, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rowCount)
  }
})
*/
  // client.end()
})
var data;
node_xj = require("xlsx-to-json-lc");
node_xj({
  input: "xls/sample_data.xls",  // input xls 
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
});
/*
var parseXlsx = require('excel');
var xsru;
parseXlsx('xls/sample_data.xls', '2',function(err, data) {
  if(err) throw err;
    // data is an array of arrays
    console.log(JSON.stringify(data));
    xsru = JSON.stringify(data);
});*/
/*
function convertToJSON(array) {
  var first = array[0].join()
  var headers = first.split(',');
  
  var jsonData = [];
  for ( var i = 1, length = array.length; i < length; i++ )
  {
   
    var myRow = array[i].join();
    var row = myRow.split(',');
    
    var data = {};
    for ( var x = 0; x < row.length; x++ )
    {
      data[headers[x]] = row[x];
    }
    jsonData.push(data);
 
  }
  return jsonData;
};*/

var index = require('./routes/index');
var auth = require('./routes/auth');
var data = require('./routes/data');

var app = express();


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(formidable());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/auth', auth);
app.use('/data',data);

/*
app.get('/' , (request,response) => {
   
  //response.send(process.env.DATABASE_URL);
  response.send("hello");
});
*/
app.get('/mqtt', function(request, response, next) {
  response.send(msg);
});

app.get('/testpg', function(request, response, next) {
   // callback
   var result;
      pool.query(query, (err, res) => {
        if (err) {
          console.log(err.stack)
          result = err.stack
        } else {
          console.log(res.rowCount)
          result = res.rowCount
        }
            response.send(result.toString() );
      })

 
} )

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;

//app.listen(3000, () => console.log('Example app listening on port 3000!'))
app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});

module.exports = app;