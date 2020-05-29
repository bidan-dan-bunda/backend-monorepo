import os from 'os';
import dotenv from 'dotenv';
import isEmpty from 'lodash/isEmpty';

const defaultConfig: { [key: string]: any } = {};

const cache: { [key: string]: any } = {};
function getConfig(key: string) {
  const env = dotenv.config().parsed;

  if (isEmpty(cache)) {
    for (const key in defaultConfig) {
      let value;
      if (env && key in env) {
        if (!Number.isNaN(Number(env[key]))) {
          value = Number(env[key]);
        }
      } else {
        value = defaultConfig[key];
      }
      cache[key] = value;
    }
  }

  return key ? cache[key] : cache;
}

module.exports = { getConfig };
