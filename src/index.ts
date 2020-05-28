import http from 'http';
import app from './app';

const debug = require('debug')('app:server');

const server = http.createServer(app);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  debug('listening on port %d', port);
});
