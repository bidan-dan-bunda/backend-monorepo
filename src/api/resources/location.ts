import { Request, Response } from 'express';
import Database from '../../orm/database';
import Province, { ProvinceModel } from './../../orm/models/reg-province';
import Regency, { RegencyModel } from '../../orm/models/reg-regency';
import District, { DistrictModel } from './../../orm/models/reg-district';
import Village, { VillageModel } from './../../orm/models/reg-village';

const provinceDb = new Database<ProvinceModel>(Province, undefined);
const regencyDb = new Database<RegencyModel>(Regency, undefined);
const districtDb = new Database<DistrictModel>(District, undefined);
const villageDb = new Database<VillageModel>(Village, undefined);

export const allProvinces = {
  route: '/provinces',
  method: 'get',
  loader: provinceDb.load.bind(provinceDb),
};

export const allRegencies = {
  route: '/regencies',
  method: 'get',
  loader: regencyDb.load.bind(regencyDb),
};

export const allDistricts = {
  route: '/districts',
  method: 'get',
  loader: districtDb.load.bind(districtDb),
};

export const allVillages = {
  route: '/villages',
  method: 'get',
  loader: villageDb.load.bind(villageDb),
};
