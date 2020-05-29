import iconv from 'iconv-lite';
require('mysql2/node_modules/iconv-lite').encodingExists('foo');
import { signin, signup, truncate, AuthErrorCodes } from '../src/auth/auth';

beforeAll(() => {
  truncate();
});

it('should reject auth from unregistered user', async () => {
  try {
    await signin({ username: 'bagaswh', password: 'polkadot69' });
  } catch (err) {
    expect(err.code).toBe(AuthErrorCodes.USER_PASSWORD_INVALID_COMBINATION);
  }
});

it('should register user', async () => {
  const ret = await signup({
    username: 'bagaswh24',
    password: 'passwordku_yg_sangat_aman_skl_bruh2469....',
    name: 'Bagas Wahyu Hidayah',
    user_type: 'u',
    full_address: 'Pakem, Sleman, DI Yogyakarta',
    telephone: '081575259164',
  });
  expect(ret).not.toBeFalsy();
});

it('should reject registering already registered user', async () => {
  try {
    await signup({
      username: 'bagaswh24',
      password: 'passwordku_yg_sangat_aman_skl_bruh2469....',
      name: 'Bagas Wahyu Hidayah',
      user_type: 'u',
      address: 'Pakem, Sleman, DI Yogyakarta',
      telephone: '081575259164',
    });
  } catch (err) {
    expect(err.code).toBe(AuthErrorCodes.USERNAME_NOT_AVAILABLE);
  }
});

it('should accept auth from registered user', async () => {
  const ret = await signin({
    username: 'bagaswh24',
    password: 'passwordku_yg_sangat_aman_skl_bruh2469....',
  });
  expect(ret).not.toBeFalsy();
});
