import { allMethodsResources } from './constants';
import {
  getSchemaForGenerator,
  generateData,
  reqToResourceUrl,
  getSchemaForValidaton,
} from './utils';

describe('resource', () => {
  describe('response object schema for non-users resources', () => {
    test('CREATE action response should successfully validate against defined schema', async () => {
      for (const resource of allMethodsResources) {
        const schema = getSchemaForGenerator(resource);
        if (schema) {
          const data = generateData(schema);
          const res = await reqToResourceUrl({ resource, body: data });
          expect(res.data).toHaveProperty('data');
          const schemaForValidation = getSchemaForValidaton(resource);
          if (schemaForValidation) {
            schemaForValidation.validateAsync(res.data.data);
          }
        }
      }
    });

    test('SHOW action response should successfully validate against defined schema', async () => {
      for (const resource of allMethodsResources) {
        const schema = getSchemaForGenerator(resource);
        if (schema) {
          const data = generateData(schema);
          const postRes = await reqToResourceUrl({ resource, body: data });
          const resourceId = postRes.data.data.id;
          const getRes = await reqToResourceUrl({
            resource,
            urlPostfix: resourceId,
            method: 'get',
          });
          const schemaForValidation = getSchemaForValidaton(resource);
          if (schemaForValidation) {
            schemaForValidation.validateAsync(getRes.data.data);
          }
        }
      }
    });
  });
});
