const path = require('path');

export const IS_PRODUCTION = process.env.NODE_ENV == 'production';
export const ROOT_PATH = path.resolve(__dirname, '../');
