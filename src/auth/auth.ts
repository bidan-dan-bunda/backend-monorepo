import * as HttpStatusCodes from 'http-status-codes';
import { ErrorMessages } from './../api/constants';
import { User, UserFields, UserDefinition } from '../orm/models/user';
import Database from '../orm/database';
import { compare, hash } from './hash';

export interface Credential {
  username: string;
  password: string;
}

export interface UserSignUpDetail extends Credential {
  user_type: string;
  username: string;
  password: string;
  name: string;
  full_address?: string;
  address_province?: string;
  address_regency?: string;
  address_district?: string;
  address_village?: string;
  telephone?: string;
  profile_img?: Buffer;
}

export enum AuthErrorCodes {
  USER_PASSWORD_INVALID_COMBINATION = 'USER_PASSWORD_INVALID_COMBINATION',
  USERNAME_NOT_AVAILABLE = 'USERNAME_NOT_AVAILABLE',
}

export class AuthError extends Error {
  constructor(
    message: string,
    public authErrorCode: AuthErrorCodes,
    public httpCode: number = 400
  ) {
    super(message);
  }
}

const userDb = new Database<User>(UserDefinition, undefined);

async function userExists(username: string) {
  return await userDb.model.findOne({ where: { username } });
}

export async function signin({ username, password }: Credential) {
  const user = await userExists(username);
  if (!user) {
    throw new AuthError(
      ErrorMessages.INVALID_CREDENTIALS,
      AuthErrorCodes.USER_PASSWORD_INVALID_COMBINATION
    );
  }
  const compareResult = await compare(password, user.password);
  if (!compareResult) {
    throw new AuthError(
      ErrorMessages.INVALID_CREDENTIALS,
      AuthErrorCodes.USER_PASSWORD_INVALID_COMBINATION
    );
  }
  return user;
}

export async function signup(userDetail: UserSignUpDetail) {
  const user = await userExists(userDetail.username);
  if (user) {
    throw new AuthError(
      ErrorMessages.USERNAME_NOT_AVAILABLE,
      AuthErrorCodes.USERNAME_NOT_AVAILABLE,
      HttpStatusCodes.CONFLICT
    );
  }

  userDetail.password = await hash(userDetail.password);

  return await userDb.model.create(userDetail);
}
