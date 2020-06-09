import Joi from '@hapi/joi';

// Joi schema
export const RequestBodyObjectSchema: { [id: string]: Joi.ObjectSchema } = {
  user: Joi.object({
    // id: Joi.number(),
    user_type: Joi.string().required(),
    name: Joi.string().required(),
    username: Joi.string().required(),
    full_address: Joi.string().allow(null),
    address_province: Joi.string().allow(null),
    address_regency: Joi.string().allow(null),
    address_district: Joi.string().allow(null),
    address_village: Joi.string().allow(null),
    telephone: Joi.string().allow(null),
    // profile_image: Joi.string().allow(null),
    // pus_id: Joi.number().allow(null),
  }),

  puskesmas: Joi.object({
    // id: Joi.number(),
    name: Joi.string().required(),
    full_address: Joi.string().allow(null),
    address_province: Joi.string().allow(null),
    address_regency: Joi.string().allow(null),
    address_district: Joi.string().allow(null),
    // profile_image: Joi.string().allow(null),
  }),

  videomateri: Joi.object({
    // id: Joi.number(),
    user_bid_id: Joi.number().required(),
    content: Joi.string().required(),
    week: Joi.number().allow(null),
    // thumbnail_url: Joi.string().allow(null),
  }),

  video: Joi.object({
    // id: Joi.number(),
    title: Joi.string().required(),
    week: Joi.number().allow(null),
    url: Joi.string().allow(null),
    // thumbnail_url: Joi.string().allow(null),
  }),

  'locations/province': Joi.object({
    // id: Joi.string(),
    name: Joi.string().required(),
  }),

  'locations/regencie': Joi.object({
    // id: Joi.string(),
    name: Joi.string().required(),
    province_id: Joi.string().required(),
  }),

  'locations/district': Joi.object({
    // id: Joi.string(),
    name: Joi.string().required(),
    regency_id: Joi.string().required(),
  }),

  'locations/village': Joi.object({
    // id: Joi.string(),
    name: Joi.string().required(),
    district_id: Joi.string().required(),
  }),
};

// array, error, single, no data
export interface ApiResponse {
  data?: any;
  message?: string;
}

export interface ApiResponseError {
  code: string;
  message?: string;
  details?: any;
}
