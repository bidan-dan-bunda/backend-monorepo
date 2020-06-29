import { IS_HEROKU } from './constants';
import * as Sentry from '@sentry/node';
import { getConfig } from './config';

export function reportError(err: any) {
  if (getConfig('USE_SENTRY') == 1 || IS_HEROKU) {
    Sentry.captureException(err);
  } else {
    console.error(err);
  }
}
