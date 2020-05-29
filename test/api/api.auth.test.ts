import { AuthErrorCodes } from './../../src/auth/auth';
import axios, { AxiosResponse, AxiosError } from 'axios';

const url = process.env.URL || 'http://localhost:3000';

function getAuthUrl(route: string): string {
  return `${url}/api/v1/auth/${route}`;
}

jest.setTimeout(1000000);

beforeAll(async () => {
  await axios.post(getAuthUrl('clear'));
});

const dummyData1 = {
  name: 'Bagas Wahyu Hidayah',
  user_type: 'u',
  username: 'bagaswh24',
  password: 'polkadot69',
  address: 'Pakem, Sleman, DI Yogyakarta',
  telephone: '081575259164',
};

const dummyData2 = {
  name: 'Bagus Mapopo Bakokok',
  user_type: 'u',
  username: 'bagusmpk22',
  password: '.bruh999.',
  address: 'Cangkringan, Sleman, DI Yogyakarta',
  telephone: '089234432234',
};

const cookies = {
  [dummyData1.username]: '',
  [dummyData2.username]: '',
};

it('should register a new user', async () => {
  const res = await axios.post(getAuthUrl('signup'), dummyData1);
  expect(res.status).toBe(200);
  expect(res.data).toMatchObject({ data: { user_id: 1 } });
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
    expect((res as AxiosResponse<any>).status).toBe(400);
    expect((res as AxiosResponse<any>).data).toEqual({
      message: 'logout required',
    });
  }
});

async function signout() {
  return await axios.post(getAuthUrl('signout'), null, {
    headers: {
      cookie: cookies[dummyData1.username],
    },
  });
}

it('should reject registering new user with unavailable username', async () => {
  await signout();
  try {
    await axios.post(getAuthUrl('signup'), dummyData1);
  } catch (err) {
    const res = err.response;
    expect(res.status).toBe(400);
    expect(res.data).toEqual({
      code: AuthErrorCodes.USERNAME_NOT_AVAILABLE,
      message: 'username is not available',
    });
  }
});
