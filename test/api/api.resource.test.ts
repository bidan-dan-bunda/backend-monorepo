import { ROOT_PATH } from './../../src/constants';
import { apiUrl, allMethodsResources, resourcesWithUploads } from './constants';
import axios from 'axios';
import { generateDummyData } from '../utils';
import fs from 'fs-extra';
import path from 'path';
import FormData from 'form-data';
import {
  createUser,
  signup,
  login,
  loginAndGetCokie,
  signupAndGetCookie,
  createResource,
  getResourceUrl,
} from './utils';
import { ObjectSchemaForGenerator, ResponseObjectSchema } from './schema';

// session cookies for authentications
let cookie = '';

beforeAll(async () => {
  cookie = await signupAndGetCookie('b');
});

describe("all methods resources' actions", () => {
  describe('create', () => {
    test('create', async () => {
      for (const resource of allMethodsResources) {
        const responseSchema = ResponseObjectSchema[resource];
        if (responseSchema) {
          const data = await createResource(resource, cookie);
          expect(data).toHaveProperty('data');
          responseSchema.validateAsync(data.data);
        }
      }
    });
  });

  describe('show', () => {
    test('show existing data', async () => {
      for (const resource of allMethodsResources) {
        const url = getResourceUrl(resource) + '/1';
        const res = await axios.get(url);
        expect(res.data).toHaveProperty('data');
        ResponseObjectSchema[resource].validateAsync(res.data.data);
      }
    });

    test('show non-existing data', async () => {
      for (const resource of allMethodsResources) {
        const url = getResourceUrl(resource) + '/1000000';
        const res = await axios.get(url, { validateStatus: () => true });
        expect(res.status).toBe(404);
        expect(res.data).toMatchObject({ message: 'Not Found' });
      }
    });
  });

  describe.skip('edit', () => {
    test('edit existing data', async () => {
      for (const resource of allMethodsResources) {
        const data = await createResource(resource, cookie);
        const url = getResourceUrl(resource) + '/' + data.data.id;
        const res = await axios.put(url, {
          headers: { cookie },
          validateStatus: () => true,
        });
        expect(res.data).toHaveProperty('message');
      }
    });

    test('edit non-existing data', async () => {
      for (const resource of allMethodsResources) {
        const url = getResourceUrl(resource) + '/1000000';
        const res = await axios.put(url, {
          headers: { cookie },
          validateStatus: () => true,
        });
        expect(res.status).toBe(404);
        expect(res.data).toHaveProperty('message');
        expect(res.data).toMatchObject({ message: 'Not Found' });
      }
    });
  });

  describe('destroy', () => {
    test('destroy existing data', async () => {
      for (const resource of allMethodsResources) {
        const data = await createResource(resource, cookie);
        const url = getResourceUrl(resource) + '/' + data.data.id;
        const res = await axios.delete(url, {
          headers: { cookie },
          validateStatus: () => true,
        });
        expect(res.status).toBe(200);
        expect(res.data).toMatchObject({ message: 'OK' });
      }
    });

    test('destroy non-existing data', async () => {
      for (const resource of allMethodsResources) {
        const url = getResourceUrl(resource) + '/1000000';
        const res = await axios.delete(url, {
          headers: { cookie },
          validateStatus: () => true,
        });
        expect(res.status).toBe(404);
        expect(res.data).toHaveProperty('message');
        expect(res.data).toMatchObject({ message: 'Not Found' });
      }
    });
  });

  test.skip('upload', async () => {
    for (const {
      name: resource,
      postfixPath,
      imageField,
    } of resourcesWithUploads) {
      const data = await createResource(resource, cookie);
      const url = getResourceUrl(resource) + '/' + data.id + '/' + postfixPath;

      const form = new FormData();
      const filepath = path.resolve(ROOT_PATH, 'tmp', 'image.jpg');
      form.append(imageField, fs.createReadStream(filepath));
      const uploadRes = await axios.post(url, form, {
        headers: { ...form.getHeaders(), cookie },
      });

      expect(uploadRes.status).toBe(202);
      expect(uploadRes.data).toMatchObject({ message: 'uploading' });
    }
  });
});
