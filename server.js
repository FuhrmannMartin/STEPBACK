const WebSocket = require('ws');
const Gpio = require('onoff').Gpio;
const led = new Gpio(17, 'out'); // GPIO17 = physical pin 11

const wss = new WebSocket.Server({ port: 8765 });

console.log('WebSocket server läuft auf ws://localhost:8765');

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', function incoming(message) {
    const text = message.toString();
    console.log('Message from Client:', text);

    if (text.trim().toLowerCase() === 'shoot!') {
      console.log('💥 Shooting LED!');
      led.writeSync(1); // Turn on LED

      setTimeout(() => {
        led.writeSync(0); // Turn off LED after 500ms
        console.log('🔌 LED off');
      }, 500);
    }
  });

  // ws.send('Welcome from Server!');
});

// Cleanup on exit
process.on('SIGINT', () => {
  led.writeSync(0);
  led.unexport();
  process.exit();
});
