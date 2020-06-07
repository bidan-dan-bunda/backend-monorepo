import { ErrorMessages } from './../../src/api/constants';
import { AuthErrorCodes } from './../../src/auth/auth';
import axios, { AxiosResponse } from 'axios';
import { createUser } from './utils';

const url = process.env.URL || 'http://localhost:3000';

function getAuthUrl(route: string): string {
  return `${url}/api/v1/auth/${route}`;
}

jest.setTimeout(50000);

const dummyData1 = createUser('u');
const dummyData2 = createUser('u');

const cookies = {
  [dummyData1.username]: '',
  [dummyData2.username]: '',
};

it('should register a new user', async () => {
  const res = await axios.post(getAuthUrl('signup'), dummyData1);
  expect(res.status).toBe(200);
  expect(res.headers['set-cookie']).not.toBeUndefined();
  cookies[dummyData1.username] = res.headers['set-cookie'][0];
});

it('should reject registering user when logged in', async () => {
  try {
    await axios.post(getAuthUrl('signup'), dummyData2, {
      headers: {
        cookie: cookies[dummyData1.username],
      },
    });
  } catch (err) {
    const res = err.response;
    expect(res.status).toBe(400);
    expect(res.data.message).toBe(ErrorMessages.LOGOUT_REQUIRED);
  }
});

it('should reject registering new user with unavailable username', async () => {
  let threw = false;
  try {
    await axios.post(getAuthUrl('signup'), dummyData1);
  } catch (err) {
    threw = true;
    const res = err.response;
    expect(res.status).toBe(400);
    expect(res.data.code).toBe(AuthErrorCodes.USERNAME_NOT_AVAILABLE);
    expect(res.data.message).toBe(ErrorMessages.USERNAME_NOT_AVAILABLE);
  }
  if (!threw) {
    throw new Error('Request did not throw');
  }
});
