import Joi from '@hapi/joi';

export const ResponseObjectSchema: { [id: string]: Joi.ObjectSchema } = {
  users: Joi.object({
    id: Joi.number(),
    user_type: Joi.string(),
    name: Joi.string(),
    username: Joi.string(),
    full_address: Joi.string().allow(null),
    address_province: Joi.string().allow(null),
    address_regency: Joi.string().allow(null),
    address_district: Joi.string().allow(null),
    address_village: Joi.string().allow(null),
    profile_image: Joi.string().allow(null),
  }),

  puskesmas: Joi.object({
    id: Joi.number(),
    name: Joi.string(),
    full_address: Joi.string().allow(null),
    address_province: Joi.string().allow(null),
    address_regency: Joi.string().allow(null),
    address_district: Joi.string().allow(null),
    profile_image: Joi.string().allow(null),
  }),

  videomateri: Joi.object({
    id: Joi.number(),
    week: Joi.number(),
    content: Joi.string(),
    thumbnail: Joi.string().allow(null),
  }),

  'locations/provinces': Joi.object({
    id: Joi.number(),
    name: Joi.string(),
  }),

  'locations/regencies': Joi.object({
    id: Joi.number(),
    name: Joi.string(),
    province_id: Joi.string(),
  }),

  'locations/districts': Joi.object({
    id: Joi.number(),
    name: Joi.string(),
    regency_id: Joi.string(),
  }),

  'locations/villages': Joi.object({
    id: Joi.number(),
    name: Joi.string(),
    district_id: Joi.string(),
  }),
};
