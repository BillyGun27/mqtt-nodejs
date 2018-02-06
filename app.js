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

app.listen(3000, () => console.log('Example app listening on port 3000!'))