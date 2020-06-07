import { RequestBodyObjectSchema } from './../../src/api/schema';
import Joi, { ObjectSchema } from '@hapi/joi';

const { user, puskesmas, videomateri, video } = RequestBodyObjectSchema;

export const ResponseObjectSchema: { [id: string]: ObjectSchema } = {
  users: user.keys({
    id: Joi.number(),
    profile_image: Joi.string().allow(null),
    pus_id: Joi.number().allow(null),
  }),

  puskesmas: puskesmas.keys({
    id: Joi.number(),
    profile_image: Joi.string().allow(null),
  }),

  videomateri: videomateri.keys({
    id: Joi.number(),
    thumbnail_url: Joi.string().allow(null),
  }),

  videos: video.keys({
    id: Joi.number(),
    thumbnail_url: Joi.string().allow(null),
  }),
};

// I have to create separate schemas to generate random data because I couldn't find
// stable Joi schema-based object generator.
export const ObjectSchemaForGenerator: { [id: string]: any } = {
  user: {
    type: 'object',
    properties: {
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
      password: {
        type: 'string',
        faker: 'internet.password',
      },
      full_address: {
        type: 'string',
        faker: 'address.secondaryAddress',
      },
      telephone: {
        type: 'string',
        faker: 'phone.phoneNumberFormat',
      },
      address_province: '11',
      address_regency: '1101',
      address_district: '1101010',
      address_village: '1101010001',
      pus_id: 1,
    },
    required: ['name', 'username', 'password', 'user_type'],
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
    },
    required: ['name'],
  },

  videomateri: {
    type: 'object',
    properties: {
      week: {
        type: 'integer',
        minimum: 0,
      },
      content: {
        type: 'string',
        faker: 'lorem.sentences',
      },
      user_bid_id: 1,
    },
    required: ['content', 'user_bid_id'],
  },

  videos: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        faker: 'name.title',
      },
      url: { type: 'string', faker: 'internet.url' },
      week: { type: 'integer', minimum: 0 },
    },
    required: ['title'],
  },
};
