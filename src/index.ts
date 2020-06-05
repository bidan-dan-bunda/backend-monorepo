import http from 'http';
import app from './app';
import d from 'debug';

const port = process.env.PORT || 3000;
const debug = d('app:server');
const server = http.createServer(app);
server.listen(port, () => {
  debug('listening on port %d', port);
});
