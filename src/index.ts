import http from 'http';
import app from './app';
import d from 'debug';
import ms from 'ms';
import { reportError } from './error';

const port = process.env.PORT || 3000;
const debug = d('app:server');
const server = http.createServer(app);
server.setTimeout(ms('30m'));

process.on('SIGINT', () => {
  process.exit();
});

process.on('unhandledRejection', reportError);

server.listen(port, () => {
  debug('listening on port %d', port);
});
