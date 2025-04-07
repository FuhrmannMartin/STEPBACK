const WebSocket = require('ws');
const { spawn } = require('child_process'); // Import child_process module

const wss = new WebSocket.Server({ port: 8765 });

console.log('WebSocket running on ws://localhost:8765');

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  let pythonProcess = null; // Store the Python process reference

  ws.on('message', function incoming(message) {
    const text = message.toString().trim();
    console.log('Message from Client:', text);

    if (text.toLowerCase() === 'start') {
      if (pythonProcess) {
        console.log('Ultrasonic controller is already running.');
        ws.send('Ultrasonic controller is already running.');
        return;
      }

      console.log('Running Ultrasonic controller...');
      try {
        // Run the Ultrasonic controller Python script
        pythonProcess = spawn('python3', ['scripts/ultrasonic_controller.py']);

        // Continuously send data from the Python script to the WebSocket client
        pythonProcess.stdout.on('data', (data) => {
          const output = data.toString().trim();
          console.log(`Ultrasonic Controller Output: ${output}`);
          ws.send(output); // Send the output to the client
        });

        pythonProcess.stderr.on('data', (data) => {
          console.error(`Ultrasonic Controller Error: ${data.toString()}`);
        });

        pythonProcess.on('close', (code) => {
          console.log(`Ultrasonic Controller exited with code ${code}`);
          ws.send('Ultrasonic controller stopped.');
          pythonProcess = null; // Reset the process reference
        });
      } catch (e) {
        console.error('Error running Ultrasonic controller:', e.message);
      }
    } else if (text.toLowerCase() === 'stop') {
      if (pythonProcess) {
        console.log('Stopping Ultrasonic controller...');
        pythonProcess.kill(); // Stop the Python script
        pythonProcess = null; // Reset the process reference
        ws.send('Ultrasonic controller stopped.');
      } else {
        console.log('No Ultrasonic controller is running.');
        ws.send('No Ultrasonic controller is running.');
      }
    } else {
      console.log('Unknown command received.');
      ws.send('Unknown command. Please send "start" or "stop".');
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected.');
    if (pythonProcess) {
      console.log('Stopping Ultrasonic controller due to client disconnection...');
      pythonProcess.kill(); // Stop the Python script
      pythonProcess = null; // Reset the process reference
    }
  });
});

// Graceful shutdown on Ctrl+C
process.on('SIGINT', () => {
  console.log('\nExiting, cleaning up...');
  process.exit();
});