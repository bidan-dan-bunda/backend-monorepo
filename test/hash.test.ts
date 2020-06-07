import { hash, compare } from '../src/auth/hash';

it('should hash plain text', async () => {
  const plain = 'PASSWORDS_THAT_ARE_LONG_AND_s3cVr3';
  expect(typeof (await hash(plain))).toBe('string');
});
