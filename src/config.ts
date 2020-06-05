import dotenv from 'dotenv';
import isEmpty from 'lodash/isEmpty';

dotenv.config();

const cache: { [key: string]: any } = {};
export function getConfig(key?: string) {
  const env = process.env;

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
