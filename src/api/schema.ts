import Joi from '@hapi/joi';

// Joi schema
export const BaseObjectSchema: { [id: string]: Joi.ObjectSchema } = {
  user: Joi.object({
    user_type: Joi.string().valid('b', 'u').required(),
    name: Joi.string().required(),
    username: Joi.string()
      .pattern(/^[a-z_]+[a-z0-9_.]*[^.]$/)
      .lowercase()
      .trim()
      .required(),
    full_address: Joi.string().allow(null),
    address_province: Joi.string().allow(null),
    address_regency: Joi.string().allow(null),
    address_district: Joi.string().allow(null),
    address_village: Joi.string().allow(null),
    telephone: Joi.string().allow(null),
    pus_id: Joi.number().allow(null),
  }),

  puskesmas: Joi.object({
    name: Joi.string().required(),
    full_address: Joi.string().allow(null),
    address_province: Joi.string().allow(null),
    address_regency: Joi.string().allow(null),
    address_district: Joi.string().allow(null),
  }),

  vaccine: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(null),
    in_stock: Joi.boolean().allow(null),
    stock: Joi.number().allow(null),
    pus_id: Joi.number().allow(null),
  }),

  videomateri: Joi.object({
    content: Joi.string().required(),
    week: Joi.number().required(),
    thumbnail_url: Joi.string().allow(null),
    author_id: Joi.number().required(),
  }),

  video: Joi.object({
    title: Joi.string().required(),
    week: Joi.number().allow(),
    url: Joi.string().allow(null),
    thumbnail_url: Joi.string().allow(null),
    author_id: Joi.number().required(),
  }),

  'locations/province': Joi.object({
    name: Joi.string().required(),
  }),

  'locations/regencie': Joi.object({
    name: Joi.string().required(),
    province_id: Joi.string().required(),
  }),

  'locations/district': Joi.object({
    name: Joi.string().required(),
    regency_id: Joi.string().required(),
  }),

  'locations/village': Joi.object({
    name: Joi.string().required(),
    district_id: Joi.string().required(),
  }),

  patient: Joi.object({
    user_id: Joi.number().required(),
    patient_note: Joi.string().optional(),
    medial_record_id: Joi.string().required(),
  }),
};

export const DerivedObjectSchema: { [id: string]: Joi.ObjectSchema } = {
  user: BaseObjectSchema.user.keys({
    password: Joi.string().min(8).required(),
    puskesmas_token: Joi.string().when('user_type', {
      is: 'b',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    device_token: Joi.string().required(),
  }),
};

export const UserLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  device_token: Joi.string().required(),
});

// array, error, single, no data
export interface ApiResponse {
  pages?: number;
  data?: any;
  message?: string;
}

export interface ApiResponseError {
  error_code?: string;
  error_message?: string;
}
