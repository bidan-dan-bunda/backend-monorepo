import { ROOT_PATH } from './../../src/constants';
import { allMethodsResources, resourcesWithUploads } from './constants';
import axios from 'axios';
import { generateDummyData } from '../utils';
import fs from 'fs-extra';
import path from 'path';
import FormData from 'form-data';
import { createResource, getResourceUrl } from './utils';
import { ResponseObjectSchema, ObjectSchemaForGenerator } from './schema';

let token = process.env.TOKEN;
let authorization = 'Bearer ' + token;

describe("all methods resources' actions", () => {
  describe('create', () => {
    test('create', async () => {
      for (const resource of allMethodsResources) {
        const responseSchema = ResponseObjectSchema[resource];
        if (responseSchema) {
          const data = await createResource(resource, { authorization });
          expect(data).toHaveProperty('data');
          responseSchema.validateAsync(data.data);
        }
      }
    });
  });

  describe('show', () => {
    test('show existing data', async () => {
      for (const resource of ['users', ...allMethodsResources]) {
        const url = getResourceUrl(resource) + '/1';
        const res = await axios.get(url, { headers: { authorization } });
        expect(res.data).toHaveProperty('data');
        ResponseObjectSchema[resource].validateAsync(res.data.data);
      }
    });

    test('show non-existing data', async () => {
      for (const resource of ['users', ...allMethodsResources]) {
        const url = getResourceUrl(resource) + '/1000000';
        const res = await axios.get(url, {
          headers: { authorization },
          validateStatus: () => true,
        });
        expect(res.status).toBe(404);
        expect(res.data).toMatchObject({ message: 'Not Found' });
      }
    });
  });

  describe('edit', () => {
    test('edit existing data', async () => {
      for (const resource of allMethodsResources) {
        const data = await createResource(resource, { authorization });
        const url = getResourceUrl(resource) + '/' + data.data.id;
        const res = await axios.put(url, data, {
          headers: { authorization },
          validateStatus: () => true,
        });
        expect(res.data).toHaveProperty('message');
      }
    });

    test('edit non-existing data', async () => {
      for (const resource of allMethodsResources) {
        const url = getResourceUrl(resource) + '/1000000';
        const dummy = generateDummyData(ObjectSchemaForGenerator[resource]);
        const res = await axios.put(url, dummy, {
          headers: { authorization },
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
        const data = await createResource(resource, { authorization });
        const url = getResourceUrl(resource) + '/' + data.data.id;
        const res = await axios.delete(url, {
          headers: { authorization },
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
          headers: { authorization },
          validateStatus: () => true,
        });
        expect(res.status).toBe(404);
        expect(res.data).toHaveProperty('message');
        expect(res.data).toMatchObject({ message: 'Not Found' });
      }
    });
  });

  test('upload', async () => {
    for (const {
      name: resource,
      postfixPath,
      imageField,
    } of resourcesWithUploads) {
      try {
        const data = await createResource(resource, { authorization });
        const url =
          getResourceUrl(resource) + '/' + data.data.id + '/' + postfixPath;

        const form = new FormData();
        const filepath = path.resolve(ROOT_PATH, 'tmp', 'image.jpg');
        form.append(imageField, fs.createReadStream(filepath));
        const uploadRes = await axios.post(url, form, {
          headers: { ...form.getHeaders(), authorization },
        });

        expect(uploadRes.status).toBe(202);
        expect(uploadRes.data).toMatchObject({ message: 'Accepted' });
      } catch (err) {
        console.log(err.response ? err.response.data : err);
      }
    }
  });
});
