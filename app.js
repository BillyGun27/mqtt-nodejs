const express = require('express');
/*var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://iot.eclipse.org')
 
client.on('connect', function () {
  client.subscribe('presence')
  client.publish('presence', 'Hello mqtt')
})
 
var msg
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
msg = message.toString()
  // client.end()
})
*/
const app = express();
app.get('/' , (request,response) => {
   
  response.send("hell");
  
});
app.get('/hope' , (request,response) => {
   
    response.send(msg);
    
});

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;

//app.listen(3000, () => console.log('Example app listening on port 3000!'))
app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});