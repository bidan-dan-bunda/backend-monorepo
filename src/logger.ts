import { IS_HEROKU } from './constants';
import loggly from 'node-loggly-bulk';
import { getConfig } from './config';
import { reportError } from './error';

const client = loggly.createClient({
  token: getConfig('LOGGLY_API_TOKEN'),
  subdomain: getConfig('LOGGLY_SUBDOMAIN'),
});

export function log(msg: any, tags?: string[]) {
  if (getConfig('USE_LOGGLY') == 1 || IS_HEROKU) {
    client.log(msg, tags, (err, results) => {
      if (err) return reportError(err);
    });
  } else {
    console.log(msg);
  }
}
