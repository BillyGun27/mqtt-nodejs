import { request } from 'http';

const express = require('express');
var mqtt = require('mqtt');
var bodyParser = require('body-parser');

var client  = mqtt.connect('mqtt://iot.eclipse.org');//mqtt://127.0.0.1

var pool = require("./connectpg");

 
client.on('connect', function () {
  client.subscribe('presence')
  client.publish('presence', '{ "value" : "100"}')
})
 
var msg
client.on('message', function (topic, message) {
  // message is Buffer
 // console.log(message.toString())
 // msg = message.toString()
 var data = JSON.parse(message.toString());
  console.log(data.value);
  msg = message.toString()

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

  // client.end()
})


var index = require('./routes/index');
var auth = require('./routes/auth');
var viewdata = require('./routes/viewdata');

var app = express();


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/', index);
app.use('/auth', auth);
app.use('/viewdata',viewdata);

/*
app.get('/' , (request,response) => {
   
  response.send(process.env.DATABASE_URL);
  
});*/
app.get('/mqtt' , (request,response) => {
   
    response.send(msg);
    
});
app.get('/data',(request,response )=>{
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
  response.send(result);
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