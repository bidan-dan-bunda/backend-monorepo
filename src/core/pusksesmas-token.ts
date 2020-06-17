import { User } from './../orm/models/user';
import { Puskesmas } from './../orm/models/puskesmas';
import { customAlphabet } from 'nanoid';
import Database from '../orm/database';
import {
  PuskesmasToken,
  PuskesmasTokenDefinition,
} from '../orm/models/puskesmas-token';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

const db = new Database<PuskesmasToken>(PuskesmasTokenDefinition, undefined);

export function generateAccessTokens(count: number = 1) {
  const tokens = [];
  for (let i = 0; i < count; i++) {
    tokens.push(nanoid());
  }
  return tokens;
}

export async function storeAccessTokens(pusId: number, tokens: string[]) {
  const records = tokens.map((token) => ({ token, pus_id: pusId }));
  return await db.model.bulkCreate(records);
}

export async function getPuskesmasByToken(token: string) {
  const tokenData = await db.model.findOne({
    where: { token },
  });
  if (tokenData) {
    const puskesmas = await tokenData.getPuskesmas();
    return puskesmas;
  }
}

export async function setUserAddressToPuskesmasAddress(
  puskesmas: Puskesmas,
  user: User
) {
  user.address_province = puskesmas.address_province;
  user.address_regency = puskesmas.address_regency;
  user.address_district = puskesmas.address_district;
  user.pus_id = puskesmas.id;
  return await user.save();
}
