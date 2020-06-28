import { getConfig } from './config';

const path = require('path');

export const IS_PRODUCTION = getConfig('NODE_ENV') == 'production';
export const IS_HEROKU = getConfig('HEROKU') == '1';
export const ROOT_PATH = path.resolve(__dirname, '../');
export const DEFAULT_UPLOAD_PATH = path.resolve(ROOT_PATH, 'tmp/uploads');
