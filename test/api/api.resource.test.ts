import Joi from '@hapi/joi';
import axios from 'axios';
import jsf from 'json-schema-faker';
import faker from 'faker';
import { ObjectSchemaForGenerator, ResponsesObjectSchema } from './schema';

const GETOnlyResources = [
  'locations/provinces',
  'locations/regencies',
  'locations/districts',
  'locations/villages',
];

const allMethodsResources = ['users', 'puskesmas', 'videomateri'];

jsf.extend('faker', () => faker);

function getURL(resource: string, version = 1) {
  return `${process.env.URL}/api/v${version}/${resource}`;
}

describe('all resources actions', () => {
  test('create', async () => {
    for (const resource of allMethodsResources) {
      const schemaForGenerator = ObjectSchemaForGenerator[resource as string];
      const responseSchema = ResponsesObjectSchema[resource];
      if (schemaForGenerator) {
        const model = jsf.generate(schemaForGenerator);
        try {
          const res = await axios.post(getURL(resource), model);
          responseSchema.validateAsync(res.data);
        } catch (err) {
          if (err.response.status == 404) {
            continue;
          }
          throw err;
        }
      }
    }
  });

  test('show', async () => {
    for (const resource of [...allMethodsResources]) {
      const url = getURL(resource) + '/1';
      try {
        const res = await axios.get(url);
        ResponsesObjectSchema[resource].validateAsync(res.data);
      } catch (err) {
        if (err.response.status == 404) {
          continue;
        }
        throw err;
      }
    }
  });
});
