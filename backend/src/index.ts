import app from './app';
import http from 'http';
import debug from 'debug';
import 'dotenv/config';

const debugLog = debug('backend:server');
const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port);
server.on('listening', onListening);
server.on('error', (err: Error) => {
  console.error('Server error:', err.message);
  debugLog('Server error: %s', err.message);
});

function onListening() {
  const addr = server.address();
  const serverUrl = `http://localhost:${
    typeof addr === 'string' ? addr : addr?.port
  }`;

  // Always log to console so users can see the server started
  console.log(`Server is running on ${serverUrl}`);
  debugLog('Listening on %s', serverUrl);
}
