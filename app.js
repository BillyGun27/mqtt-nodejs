const express = require('express');
var path = require('path');
const mqtt = require('mqtt');
const bodyParser = require('body-parser');


const client  = mqtt.connect('mqtt://iot.eclipse.org');//mqtt://127.0.0.1


 
client.on('connect', function () {
  client.subscribe('machine')
  client.subscribe('sensor')
  client.publish('sensor', '100')
 // client.publish('machine','0')
  //client.publish('machine','1')
})
 


var checkmqtt = "F";
client.on('message', function (topic, message) {
  // message is Buffer
 // console.log(message.toString())
 checkmqtt = topic +"="+message.toString();
  console.log(checkmqtt);


  // client.end()
})





var index = require('./routes/index');
var auth = require('./routes/auth');
var data = require('./routes/data');

var app = express();


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//app.use(formidable());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/auth', auth);
app.use('/data',data);

app.get('/mqtt', function(request, response, next) {
  response.send(checkmqtt);
});



// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;

//app.listen(3000, () => console.log('Example app listening on port 3000!'))
app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});

module.exports = app;