import jwt from 'jsonwebtoken';
import { getConfig } from '../config';

const JWT_SECRET = getConfig('JWT_SECRET');

export async function verifyToken(token: string): Promise<object | undefined> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      return resolve(decoded);
    });
  });
}
