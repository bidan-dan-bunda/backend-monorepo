const path = require('path');

export const IS_PRODUCTION = process.env.NODE_ENV == 'production';
export const ROOT_PATH = path.resolve(__dirname, '../');
export const DEFAULT_UPLOAD_PATH = path.resolve(ROOT_PATH, 'tmp/uploads');
