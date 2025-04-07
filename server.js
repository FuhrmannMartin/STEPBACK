const WebSocket = require('ws');
const Gpio = require('onoff').Gpio;

// Try initializing GPIO pin 17 for output
let led;
try {
  led = new Gpio(17, 'out'); // GPIO17 = physical pin 11
} catch (err) {
  console.error('Error initializing GPIO:', err.message);
  process.exit(1);
}

const wss = new WebSocket.Server({ port: 8765 });

console.log('WebSocket running on ws://localhost:8765');

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', function incoming(message) {
    const text = message.toString().trim();
    console.log('Message from Client:', text);

    if (text.toLowerCase() === 'shoot!') {
      console.log('Shooting LED!');
      try {
        led.writeSync(1); // Turn on LED
        setTimeout(() => {
          led.writeSync(0); // Turn off LED after 500ms
          console.log('LED off');
        }, 500);
      } catch (e) {
        console.error('GPIO error:', e.message);
      }
    }
  });
});

// Graceful shutdown on Ctrl+C
process.on('SIGINT', () => {
  console.log('\nExiting, cleaning up GPIO...');
  try {
    led.writeSync(0);
    led.unexport();
  } catch (e) {
    console.error('GPIO cleanup error:', e.message);
  }
  process.exit();
});
