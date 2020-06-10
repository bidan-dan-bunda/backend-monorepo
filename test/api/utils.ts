import { authUrl, apiUrl } from './constants';
import axios from 'axios';
import { generateDummyData } from '../utils';
import { ObjectSchemaForGenerator } from './schema';

export function createUser(userType: 'b' | 'u') {
  const user = generateDummyData(ObjectSchemaForGenerator.user);
  user.user_type = userType;
  return user;
}

export async function login(user: any) {
  const { username, password } = user;
  return await axios.post(authUrl + '/signin', {
    username,
    password,
  });
}

export async function signup(user: any) {
  return axios.post(authUrl + '/signup', user);
}

export async function loginAndGetCokie(user: any) {
  const loginRes = await login(user);
  return loginRes.headers['set-cookie'][0];
}

export async function signupAndGetCookie(userType: 'b' | 'u') {
  const userData = createUser(userType);
  await signup(userData);
  return await loginAndGetCokie(userData);
}

export function getResourceUrl(resource: string, version = 1) {
  return `${apiUrl}/${resource}`;
}

export function createResourceData(resource: string) {
  const schema = ObjectSchemaForGenerator[resource];
  if (schema) {
    return generateDummyData(schema);
  }
}

export async function postResourceData(
  url: string,
  data: any,
  { cookie = '', authorization = '' }: any
) {
  const res = await axios.post(url, data, {
    headers: { cookie, authorization },
  });
  return res.data;
}

export async function createResource(
  resource: string,
  { cookie, authorization }: any
) {
  const data = createResourceData(resource);
  const url = getResourceUrl(resource);
  return await postResourceData(url, data, { cookie, authorization });
}

const token = process.env.TOKEN;
const authorization = 'Bearer ' + token;

export function requestWithToken(
  url: any,
  method: any,
  body?: any,
  headers?: object
) {
  return axios({
    url,
    method,
    data: body,
    headers: { authorization, ...headers },
  });
}
