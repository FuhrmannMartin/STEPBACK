const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8765 });

console.log('WebSocket server läuft auf ws://localhost:8765');

wss.on('connection', function connection(ws) {
  console.log('Client verbunden');

  ws.on('message', function incoming(message) {
    console.log('Nachricht vom Client:', message.toString());
    // ws.send(`Server hat erhalten: ${message}`);
  });
});
