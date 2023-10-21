const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const { v4: uuidv4 } = require('uuid');
const randomstring = require("randomstring");

const app = express();
const server = http.createServer(app);
const publicPath = path.join(__dirname, 'public');
app.use('/public', express.static(publicPath));

const wss = new WebSocket.Server({
  server
});

// map of client connections:
const clients = new Map();

wss.on('connection', (ws) => {

  // Generate a UUID for the connection
  const id = uuidv4();
  const metadata = { id };

  clients.set(ws, metadata);
  console.log(`Recieved a new connection : ${metadata.id}`);

  ws.on('error', console.error);
  ws.on('close', () => {
    closeConnection(ws)
  });
  ws.on('message', (message) => {
    sendMessage(message, ws);
  });

});

function formatMessageToString(message, type = 'message') {
  return JSON.stringify({ 'type': type, 'message': message, 'timestamp': new Date() });
}

function closeConnection(ws) {
  metadata = clientGetMetadata(ws);
  // Remove the connection from your data structure when the client disconnects
  console.log(`${new Date().toISOString()} | Closing connection for client : ${metadata.id}`);
  clients.delete(ws);
}

function clientGetMetadata(ws) {
  // get the metadata for the client
  const metadata = clients.get(ws);
  console.log(`Client : ${metadata.id}`);
  return metadata;
}

function sendMessage(message, ws) {
  metadata = clientGetMetadata(ws);
  console.log(`Received message : ${message.toString()}`);
  // loop through all connected clients
  wss.clients.forEach((client) => {
    // dont send the message to the client that sent it
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      console.log(`Sending message to other clients`);
      // just re-transmit the message to other clients
      client.send(formatMessageToString(message.toString()));
    } else if (client === ws && client.readyState === WebSocket.OPEN) {
      console.log(`Sending response to message`);
      // respond to sending client
      client.send(formatMessageToString('Message was received by server', 'status'));
    }
  });
}

// Send random JSON message to clients every 10 seconds
setInterval(() => {
  wss.clients.forEach((client, ws) => {
    if (client.readyState === WebSocket.OPEN) {
      const metadata = clients.get(ws);
      console.log(`Broadcasting random timed message to client : ${metadata.id}.`)
      client.send(formatMessageToString('Random Message - ' + randomstring.generate()));
    }
  });
}, 1000);


server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
