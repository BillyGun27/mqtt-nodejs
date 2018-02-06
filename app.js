const express = require('express');
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://iot.eclipse.org')

const pg = require('pg');
//const connectionString = process.env.DATABASE_URL || 'friikdyehsyedi://ec2-23-21-162-90.compute-1.amazonaws.com:5432/dake2nd0sealua';

//const db = new pg.Client(connectionString);
//db.connect();
const db = new pg.Client({
  user: 'friikdyehsyedi',
  host: 'ec2-23-21-162-90.compute-1.amazonaws.com',
  database: 'dake2nd0sealua',
  password: '4c3f833eb344a184e37ea0be9cb062f45d92b5ae44d47daf66f3605bd90989e0',
  port: 5432,
})
db.connect()

db.query('INSERT INTO sensor (value) VALUES ($1::text as message)', ['100'], (err, res) => {
  console.log(err ? err.stack : res.rows[0].message) // Hello World!
  db.end()
})

 
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


/*
const { Client } = require('pg')
const client = new Client()

client.connect()

client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
  console.log(err ? err.stack : res.rows[0].message) // Hello World!
  client.end()
})
*/ 