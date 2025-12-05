import app from './app';
import http from 'http';
import debug from 'debug';

const server = http.createServer(app);

server.listen(process.env.PORT || 3000);
server.on('listening', onListening);
server.on('error', (err: Error) => {
  debug(err.message);
});

function onListening() {
  const addr = server.address();
  debug(
    `Listening on http://localhost:${
      typeof addr === 'string' ? addr : addr?.port
    }`
  );
}
