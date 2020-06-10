import { allMethodsResources } from './constants';
import {
  createResource,
  createResourceData,
  postResourceData,
  getResourceUrl,
} from './utils';

let token = process.env.TOKEN;
let authorization = 'Bearer ' + token;

describe('request body validation', () => {
  test('should accept valid request body for each resource', async () => {
    try {
      for (const resource of allMethodsResources) {
        await createResource(resource, { authorization });
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  });

  test('should reject invalid request body for each request', async () => {
    let threw = false;
    try {
      for (const resource of allMethodsResources) {
        const data = await createResourceData(resource);
        delete data.name;
        const url = getResourceUrl(resource);
        await postResourceData(url, data, { authorization });
      }
    } catch (err) {
      threw = true;
    }
    if (!threw) {
      throw new Error('Test did not throw');
    }
  });
});
