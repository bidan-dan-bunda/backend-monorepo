import { baseUrl } from './constants';
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
const dummyData3 = createUser('u');

const cookies = {
  [dummyData1.username]: '',
  [dummyData2.username]: '',
  [dummyData3.username]: '',
};

describe('admin', () => {
  it('should accept request containing valid authorization token', async () => {
    const token = process.env.TOKEN;
    const res = await axios.get(baseUrl + '/api/v1', {
      headers: { authorization: 'Bearer ' + token },
    });
    expect(res.data).toMatchObject({ message: 'Hello :)' });
  });

  it('should reject request containing invalid authorization token', async () => {
    const token = 'fafifu';
    expect(
      axios.get(baseUrl + '/api/v1', {
        headers: { authorization: 'Bearer ' + token },
      })
    ).rejects.toThrow();
  });
});

describe('regular users', () => {
  // Data #1 [success]
  it('should register a new user', async () => {
    const res = await axios.post(getAuthUrl('signup'), dummyData1);
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).not.toBeUndefined();
    cookies[dummyData1.username] = res.headers['set-cookie'][0];
  });

  // Data #2 [failed]
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

  // Data #1 [failed]
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

  // Data #2 [success]
  it('should accept logging in with valid credentials', async () => {
    await axios.post(getAuthUrl('signup'), dummyData2);
    try {
      axios.post(getAuthUrl('signin'), {
        username: dummyData2.username,
        password: dummyData2.password,
      });
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data).toMatchObject({
        message: ErrorMessages.INVALID_CREDENTIALS,
      });
    }
  });

  // Data #3 [failed]
  it('should reject logging in with invalid credentials', async () => {
    await axios.post(getAuthUrl('signup'), dummyData3);
    try {
      axios.post(getAuthUrl('signin'), {
        username: dummyData3.username,
        password: dummyData3.password + 'qwertyuioasdfghjkzxcvbnm',
      });
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data).toMatchObject({
        message: ErrorMessages.INVALID_CREDENTIALS,
      });
    }
  });
});
