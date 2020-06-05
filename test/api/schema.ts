import Joi from '@hapi/joi';

// Joi schema
export const ResponsesObjectSchema: { [id: string]: Joi.ObjectSchema } = {
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
    telephone: Joi.string().allow(null),
    pus_id: Joi.number().allow(null),
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
    user_bid_id: Joi.number(),
    video_id: Joi.number().allow(null),
  }),

  'locations/provinces': Joi.object({
    id: Joi.string(),
    name: Joi.string(),
  }),

  'locations/regencies': Joi.object({
    id: Joi.string(),
    name: Joi.string(),
    province_id: Joi.string(),
  }),

  'locations/districts': Joi.object({
    id: Joi.string(),
    name: Joi.string(),
    regency_id: Joi.string(),
  }),

  'locations/villages': Joi.object({
    id: Joi.string(),
    name: Joi.string(),
    district_id: Joi.string(),
  }),
};

// I have to create separate schemas to generate random data because I couldn't find
// stable joi schema-based object generator.
export const ObjectSchemaForGenerator: { [id: string]: any } = {
  users: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        min: 1,
      },
      user_type: {
        type: 'string',
        pattern: 'b|u',
      },
      name: {
        type: 'string',
        faker: 'name.findName',
      },
      username: {
        type: 'string',
        faker: 'internet.userName',
      },
      full_address: {
        type: 'string',
        faker: 'address.secondaryAddress',
      },
      telephone: {
        type: 'string',
        faker: 'phone.phoneNumber',
      },
      address_province: {
        type: 'string',
        pattern: '\\d{2}',
      },
      address_regency: {
        type: 'string',
        pattern: '\\d{4}',
      },
      address_district: {
        type: 'string',
        pattern: '\\d{7}',
      },
      address_village: {
        type: 'string',
        pattern: '\\d{10}',
      },
      pus_id: {
        type: 'integer',
        min: 1,
      },
    },
  },

  puskesmas: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        faker: 'company.companyName',
      },
      full_address: {
        type: 'string',
        faker: 'address.secondaryAddress',
      },
      address_province: '11',
      address_regency: '1101',
      address_district: '1101010',
      address_village: '1101010001',
    },
  },

  videomateri: {
    week: {
      type: 'integer',
      min: 0,
    },
    content: {
      type: 'string',
      faker: 'lorem.sentences',
    },
    user_bid_id: '1',
  },
};
