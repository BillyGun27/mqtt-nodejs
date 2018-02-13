const express = require('express');
var path = require('path');
const formidable = require('express-formidable');
const mqtt = require('mqtt');
const bodyParser = require('body-parser');
var moment = require('moment-timezone');

const client  = mqtt.connect('mqtt://iot.eclipse.org');//mqtt://127.0.0.1

const pool = require("./connectpg");

 
client.on('connect', function () {
  client.subscribe('machine')
  client.subscribe('sensor')
 // client.publish('sensor', '100')
  client.publish('machine','0')
  //client.publish('machine','1')
})
 


var msg
client.on('message', function (topic, message) {
  // message is Buffer
 // console.log(message.toString())
 // msg = message.toString()
 var ind = moment().tz("Asia/Jakarta")

 var table ,content;
 switch (topic) {
   case "machine":
    table = "mesin"
    content = "status_mesin";
    console.log(topic,"+",message.toString());
    Sendpgsql(table,content,message,ind);
     break;
   case "sensor":
    table = "sensor"
    content = "do_value";
    msg = topic,"+",message.toString()
  console.log(msg);
    Sendpgsql(table,content,message,ind);
     break;
   
 }
  



  // client.end()
})

function Sendpgsql(table,content,message,ind){
  console.log(table);
  var query = {
    // give the query a unique name
    name: table,
    text: 'INSERT INTO ' + table+ '('+ content +' ,receive_date,receive_time) VALUES ($1,$2,$3) ',
    values: [  message.toString()  ,ind.format('DD/MM/YY'),ind.format('HH:mm:ss')]
  }

  // callback
pool.query(query, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rowCount)
  }
})

}

var data;
node_xj = require("xlsx-to-json-lc");
node_xj({
  input: "xls/sample_data.xls",  // input xls 
  output: null, // output json 
  lowerCaseHeaders:true
}, function(err, result) {
  if(err) {
    data = err;
   // console.error(err);
  } else {
    data = result;
  //  console.log(result);
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

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(formidable());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/auth', auth);
app.use('/data',data);
/*
var passwordHash = require('password-hash');

    var hashedPassword = passwordHash.generate('password123');

    console.log(hashedPassword); // sha1$3I7HRwy7$cbfdac6008f9cab4083784cbd1874f76618d2a97

    var hashedPassword = 'sha1$ca4cb726$1$9179553941a35688832f486a0540df6d64ca5e6d';
    
    console.log(passwordHash.verify('password123', hashedPassword)); // true
    console.log(passwordHash.verify('Password0', hashedPassword)); // false*/
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