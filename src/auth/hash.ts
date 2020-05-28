import bcrypt from 'bcrypt';

export function hash(plain: string, saltRounds = 12): Promise<string> {
  return bcrypt.hash(plain, saltRounds);
}

export function compare(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
