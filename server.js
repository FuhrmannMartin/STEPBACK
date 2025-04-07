const WebSocket = require('ws');
const { spawn } = require('child_process'); // Import child_process module

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
        // Run the Python script
        const pythonProcess = spawn('python3', ['scripts/led_controller.py']);

        // Handle output from the Python script
        pythonProcess.stdout.on('data', (data) => {
          console.log(`Python script output: ${data.toString()}`);
        });

        pythonProcess.stderr.on('data', (data) => {
          console.error(`Python script error: ${data.toString()}`);
        });

        pythonProcess.on('close', (code) => {
          console.log(`Python script exited with code ${code}`);
        });

        setTimeout(() => {
          console.log('LED off');
        }, 500);
      } catch (e) {
        console.error('Error running Python script:', e.message);
      }
    }
  });
});