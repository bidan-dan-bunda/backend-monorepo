import { BaseObjectSchema } from './../../src/api/schema';
import Joi, { ObjectSchema } from '@hapi/joi';

const { user, puskesmas, videomateri, video } = BaseObjectSchema;

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
  users: {
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
      device_token: 'POAPODPASODAPSODPASODAPSDOAPS',
    },
    required: ['name', 'username', 'password', 'user_type', 'device_token'],
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
      week: 1 /* {
        type: 'integer',
        minimum: 0,
        maximum: 40,
      }, */,
      content: {
        type: 'string',
        faker: 'lorem.sentences',
      },
      thumbnail_url: 'https://placeimg.com/640/480/any',
    },
    required: ['content', 'thumbnail_url', 'week'],
  },

  videos: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        faker: 'name.title',
      },
      url: { type: 'string', faker: 'internet.url' },
      thumbnail_url: 'https://placeimg.com/640/480/any',
      // week: { type: 'integer', minimum: 0, maximum: 40 },
      week: 1,
    },
    required: ['title', 'thumbnail_url', 'week'],
  },
};
