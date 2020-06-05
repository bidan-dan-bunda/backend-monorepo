import dotenv from 'dotenv';
import isEmpty from 'lodash/isEmpty';

const cache: { [key: string]: any } = {};
export function getConfig(key?: string) {
  const env = dotenv.config().parsed;

  if (isEmpty(cache)) {
    for (const key in env) {
      let value;
      if (!Number.isNaN(Number(env[key]))) {
        value = Number(env[key]);
      } else {
        value = env[key];
      }
      cache[key] = value;
    }
  }

  return key ? cache[key] : cache;
}
