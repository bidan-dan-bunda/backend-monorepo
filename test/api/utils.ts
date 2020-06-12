import faker from 'faker/locale/id_ID';
import {
  authUrl,
  apiUrl,
  axiosConfigDefaults,
  authorizationHeader,
} from './constants';
import { ObjectSchemaForGenerator, ResponseObjectSchema } from './schema';
import jsf from 'json-schema-faker';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import delay from 'delay';

// axios requests
axios.defaults.validateStatus = axiosConfigDefaults.validateStatus;

interface RequestConfig {
  url: string;
  method: any;
  authentication?: 'authorization' | 'cookie';
  authorization?: string;
  cookie?: string;
  body?: any;
  config?: AxiosRequestConfig;
}

export function req({ url, method, body, config }: RequestConfig) {
  return axios({
    url,
    method,
    data: body,
    ...config,
  });
}

export function reqWithAuthorization({
  url,
  method,
  authorization = authorizationHeader,
  body,
  config = {},
}: RequestConfig) {
  return req({
    url,
    method,
    body,
    config: {
      headers: {
        authorization,
        ...config,
      },
    },
  });
}

export function reqWithSessionCookies({
  url,
  method,
  cookie,
  body,
  config,
}: RequestConfig) {
  return req({
    url,
    method,
    body,
    config: {
      headers: {
        cookie,
        ...config,
      },
    },
  });
}

export function reqToResourceUrl({
  resource,
  urlPostfix = '',
  method = 'post',
  authentication = { authorization: authorizationHeader },
  body,
  config,
}: RequestConfig & any): AxiosPromise<any> {
  let fn: any;
  if (authentication) {
    fn = authentication.authorization
      ? reqWithAuthorization
      : reqWithSessionCookies;
  } else {
    fn = req;
  }
  return fn({
    url: resourceUrl(resource) + '/' + urlPostfix,
    method,
    body,
    config,
    cookie: authentication.cookie,
    authorization: authentication.authorization,
  });
}

// data generator
export function getSchemaForGenerator(resource: string) {
  return ObjectSchemaForGenerator[resource];
}

export function getSchemaForValidaton(resource: string) {
  return ResponseObjectSchema[resource];
}

jsf.extend('faker', () => faker);
export function generateData(schema: any) {
  return jsf.generate(schema);
}

// url
export const resourceUrl = (resource: string) => `${apiUrl}/${resource}`;
export const authActionUrl = (action: string) => `${authUrl}/${action}`;

// auth
export async function signin(credential: any) {
  return req({
    url: authActionUrl('signin'),
    method: 'post',
    body: credential,
  });
}

export async function signup(user: any) {
  return req({
    url: authActionUrl('signup'),
    method: 'post',
    body: user,
  });
}

// get puskesmas token
export async function createPuskesmasAndGetTokens() {
  const puskesmasSchema = getSchemaForGenerator('puskesmas');
  const puskesmas = generateData(puskesmasSchema);
  const res = await reqToResourceUrl({
    resource: 'puskesmas',
    body: puskesmas,
  });
  await delay(2000);
  const puskesmasId = res.data.data.id;
  const fetchTokensRes = await reqToResourceUrl({
    resource: 'puskesmas',
    urlPostfix: puskesmasId + '/tokens',
    method: 'get',
  });
  const token = fetchTokensRes.data.data[0];
  return token.token;
}
