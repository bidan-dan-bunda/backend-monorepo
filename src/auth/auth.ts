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
  USER_PASSWORD_INVALID_COMBINATION,
  USERNAME_NOT_AVAILABLE,
}

export class AuthError extends Error {
  public code: AuthErrorCodes;

  constructor(message: string, authErrorCode: AuthErrorCodes) {
    super(message);
    this.code = authErrorCode;
  }
}

const database = new Database<User>(UserDefinition, undefined);

async function userExists(username: string) {
  return await database.model.findOne({ where: { username } });
}

export async function signin({ username, password }: Credential) {
  const user = await userExists(username);
  if (!user) {
    throw new AuthError(
      'User and password combination is invalid',
      AuthErrorCodes.USER_PASSWORD_INVALID_COMBINATION
    );
  }
  const compareResult = await compare(password, user.password);
  if (!compareResult) {
    throw new AuthError(
      'User and password combination is invalid',
      AuthErrorCodes.USER_PASSWORD_INVALID_COMBINATION
    );
  }
  return user.toJSON() as User;
}

function validateUserDetail(userDetail: UserSignUpDetail) {}

export async function signup(userDetail: UserSignUpDetail) {
  const user = await userExists(userDetail.username);
  if (user) {
    throw new AuthError(
      'username is not available',
      AuthErrorCodes.USERNAME_NOT_AVAILABLE
    );
  }

  validateUserDetail(userDetail);
  userDetail.password = await hash(userDetail.password);

  return (await database.model.create(userDetail)).toJSON() as UserFields;
}

export async function signout(user: UserSignUpDetail) {}

// testing purpose
export async function truncate() {
  return await database.model.truncate();
}
