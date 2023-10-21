const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const { v4: uuidv4 } = require('uuid');
const randomstring = require("randomstring");

const clients = {};

// const uuid = uuidv4();
// console.log(uuid);

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({
  server
  //port: 3001
});

const publicPath = path.join(__dirname, 'public');
app.use('/public', express.static(publicPath));

wss.on('connection', (ws, connection) => {

  const userId = uuidv4();
  console.log(`Recieved a new connection.`);

  // Store the new connection and handle messages
  clients[userId] = connection;
  console.log(`${userId} connected.`);

  ws.on('error', console.error);
  ws.on('message', (message) => {
    console.log('Received message : ' + message.toString());
    // loop through all connected clients
    wss.clients.forEach((client) => {
      // dont send the message to the client that sent it
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log("Sending message to other clients");
        // just re-transmit the message to other clients
        client.send(formatMessageToString(message.toString()));
      } else if (client === ws && client.readyState === WebSocket.OPEN) {
        console.log("Sending response to message");
        // respond to sending client
        client.send(formatMessageToString('Message was received by server', 'status'));
      }
    });
    // ws.on('close', (connection) => {
    //   console.log(new Date() + ' | Closing connection for a client.');
    // });
    //Broadcast message
    //console.log("broadcast message")
    //ws.send(formatMessageToString('Broadcast message'));
  });
});

function formatMessageToString(message, type = 'message') {
  return JSON.stringify({ 'type': type, 'message': message, 'timestamp': new Date() });
}

// Send random JSON message to clients every 30 seconds
setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      //console.log(JSON.stringify(client));
      console.log(`Broadcasting random timed message to client : ${client.id}.`)
      client.send(formatMessageToString('Random Message - ' + randomstring.generate()));
    }
  });
}, 7500);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
