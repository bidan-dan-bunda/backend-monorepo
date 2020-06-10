import { ErrorMessages } from './../../src/api/constants';
import {
  reqWithAuthorization,
  generateData,
  getSchemaForGenerator,
  req,
  authActionUrl,
  reqWithSessionCookies,
} from './utils';
import { axiosConfigDefaults, apiUrl } from './constants';
import axios from 'axios';

axios.defaults = { ...axios.defaults, ...axiosConfigDefaults };

// requirements
// - admin SHOULD has all privileges ON ALL RESOURCES
// - regular users SHOULD ONLY be able to SIGNUP, SIGNIN, SIGNOUT, and EDIT its own profile

describe('authentication', () => {
  describe('admin', () => {
    test('should be able to access api/v1', async () => {
      const res = await reqWithAuthorization({
        url: `${apiUrl}`,
        method: 'get',
      });
      expect(res.status).toBe(200);
    });

    test('should reject request with invalid authorization token', async () => {
      const res = await reqWithAuthorization({
        url: `${apiUrl}`,
        authorization: 'bababa',
        method: 'get',
      });
      expect(res.status).toBe(401);
    });
  });

  describe('regular users', () => {
    const cookies: any = {};
    const schema = getSchemaForGenerator('users');
    const user1 = generateData(schema);

    test('should register new user', async () => {
      const res = await req({
        url: authActionUrl('signup'),
        method: 'post',
        body: user1,
      });
      expect(res.status).toBe(200);
      const cookie = res.headers['set-cookie'][0];
      cookies[user1.username] = cookie;
    });

    test('should reject registering new user when logged in', async () => {
      const user3 = generateData(schema);
      const res = await reqWithSessionCookies({
        cookie: cookies[user1.username],
        url: authActionUrl('signup'),
        method: 'post',
        body: user3,
      });
      expect(res.status).toBe(205);
      expect(res.data).toMatchObject({
        message: ErrorMessages.LOGOUT_REQUIRED,
      });
    });

    test('should reject registering new user with unavailable username', async () => {
      const res = await req({
        url: authActionUrl('signup'),
        method: 'post',
        body: user1,
      });
      expect(res.status).toBe(400);
    });

    test('should accept login with correct credential', async () => {
      const res = await req({
        url: authActionUrl('signin'),
        method: 'post',
        body: { username: user1.username, password: user1.password },
      });
      expect(res.status).toBe(200);
      const cookie = res.headers['set-cookie'][0];
      cookies[user1.username] = cookie;
    });

    test('should reject login correctly with correct credential', async () => {
      const user2 = generateData(schema);
      const res = await req({
        url: authActionUrl('signin'),
        method: 'post',
        body: { username: user2.username, password: user2.password },
      });
      expect(res.status).toBe(401);
    });

    test('should reject login when already logged in', async () => {
      const res = await reqWithSessionCookies({
        cookie: cookies[user1.username],
        url: authActionUrl('signin'),
        method: 'post',
        body: { username: user1.username, password: user1.password },
      });
      expect(res.status).toBe(205);
      expect(res.data).toMatchObject({
        message: ErrorMessages.ALREADY_LOGGED_IN,
      });
    });

    test('should logout succesfully', async () => {
      const res = await reqWithSessionCookies({
        cookie: cookies[user1.username],
        url: authActionUrl('signout'),
        method: 'post',
      });
      expect(res.status).toBe(200);
    });

    test('should reject logging out when not logged in', async () => {
      const res = await reqWithSessionCookies({
        cookie: cookies[user1.username],
        url: authActionUrl('signout'),
        method: 'post',
      });
      expect(res.status).toBe(205);
      expect(res.data).toMatchObject({
        message: ErrorMessages.NOT_LOGGED_IN,
      });
    });
  });
});
