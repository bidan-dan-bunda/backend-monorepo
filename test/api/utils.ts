import { authUrl } from './constants';
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
