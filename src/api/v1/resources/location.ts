import { Request } from 'express';
import { ResourcePage } from '../../middlewares';
import Database from '../../../orm/database';
import { Province, ProvinceDefinition } from '../../../orm/models/reg-province';
import { Regency, RegencyDefinition } from '../../../orm/models/reg-regency';
import { District, DistrictDefinition } from '../../../orm/models/reg-district';
import { Village, VillageDefinition } from '../../../orm/models/reg-village';

const provinceDb = new Database<Province>(ProvinceDefinition, undefined);
const regencyDb = new Database<Regency>(RegencyDefinition, undefined);
const districtDb = new Database<District>(DistrictDefinition, undefined);
const villageDb = new Database<Village>(VillageDefinition, undefined);

/* provinces */
export const indexProvinces = {
  route: '/provinces',
  method: 'get',
  load: (req: Request, locals: any, params: any) =>
    provinceDb.load(locals.page as ResourcePage),
};

export const showProvince = {
  route: '/provinces/:provinceId',
  method: 'get',
  load: (req: Request, locals: any, params: any) =>
    provinceDb.model.findByPk(params.provinceId),
};

export const provinceRegencies = {
  route: '/provinces/:provinceId/regencies',
  method: 'get',
  load(req: Request, locals: any, params: any) {
    return provinceDb.model.findByPk(params.provinceId, {
      include: [Province.associations.regencies],
    });
  },
};

/* regencies */
export const indexRegencies = {
  route: '/regencies',
  method: 'get',
  load: (req: Request, locals: any, params: any) =>
    regencyDb.load(locals.page as ResourcePage),
};

export const showRegency = {
  route: '/regencies/:regencyId',
  method: 'get',
  load: (req: Request, locals: any, params: any) =>
    regencyDb.model.findByPk(params.regencyId),
};

export const regencyDistricts = {
  route: '/regencies/:regencyId/districts',
  method: 'get',
  load(req: Request, locals: any, params: any) {
    return regencyDb.model.findByPk(params.regencyId, {
      include: [Regency.associations.districts],
    });
  },
};

/* districts */
export const indexDistricts = {
  route: '/districts',
  method: 'get',
  load: (req: Request, locals: any, params: any) =>
    districtDb.load(locals.page as ResourcePage),
};

export const showDistrict = {
  route: '/districts/:districtId',
  method: 'get',
  load: (req: Request, locals: any, params: any) =>
    districtDb.model.findByPk(params.districtId),
};

export const villageDistricts = {
  route: '/districts/:districtId/villages',
  method: 'get',
  load(req: Request, locals: any, params: any) {
    return districtDb.model.findByPk(params.districtId, {
      include: [District.associations.villages],
    });
  },
};

/* villages */
export const allVillages = {
  route: '/villages',
  method: 'get',
  load: (req: Request, locals: any, params: any) =>
    villageDb.load(locals.page as ResourcePage),
};

export const showVillage = {
  route: '/villages/:villageId',
  method: 'get',
  load: (req: Request, locals: any, params: any) =>
    villageDb.model.findByPk(params.villageId),
};
