const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 8080,
});

wss.on('connection', (ws) => {
    ws.send('Welcome to the chat, enjoy :)');

    ws.on('message', (data) => {
        console.log(data.toString());
        wss.clients.forEach((client) => {
            console.log(client.toString());
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                console.log("here");
                client.send(data);
            }
        });
    });
});