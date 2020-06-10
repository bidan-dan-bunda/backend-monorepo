import { getConfig } from '../src/config';
import jwt from 'jsonwebtoken';
import ms from 'ms';

const JWT_SECRET = getConfig('JWT_SECRET');

const token = jwt.sign(
  { exp: Date.now() + ms('15d'), role: 'admin' },
  JWT_SECRET
);
console.log(token);
