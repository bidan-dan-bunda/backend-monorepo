import { ROOT_PATH } from './../../src/constants';
import { apiUrl, allMethodsResources, resourcesWithUploads } from './constants';
import axios from 'axios';
import { ObjectSchemaForGenerator, ResponsesObjectSchema } from './schema';
import { generateDummyData } from '../utils';
import fs from 'fs-extra';
import path from 'path';
import FormData from 'form-data';
import { createUser, signup, login } from './utils';

function getUrl(resource: string, version = 1) {
  return `${apiUrl}/${resource}`;
}

async function createResource(resource: string, cookie: string) {
  const url = getUrl(resource);
  const schema = ObjectSchemaForGenerator[resource];
  if (schema) {
    const data = generateDummyData(schema);
    const res = await axios.post(url, data, { headers: { cookie } });
    return res.data;
  }
}

// session cookies for authentications
let cookie = '';

beforeAll(async () => {
  const userData = createUser('b');
  await signup(userData);
  const loginRes = await login(userData);
  cookie = loginRes.headers['set-cookie'][0];
});

describe("all methods resources' actions", () => {
  test('create', async () => {
    for (const resource of allMethodsResources) {
      const responseSchema = ResponsesObjectSchema[resource];
      if (responseSchema) {
        const data = await createResource(resource, cookie);
        responseSchema.validateAsync(data);
      }
    }
  });

  test('show', async () => {
    for (const resource of allMethodsResources) {
      const url = getUrl(resource) + '/1';
      const res = await axios.get(url);
      ResponsesObjectSchema[resource].validateAsync(res.data);
    }
  });

  test('edit', async () => {
    for (const resource of allMethodsResources) {
      const data = await createResource(resource, cookie);
      ResponsesObjectSchema[resource].validateAsync(data);
    }
  });

  test('destroy', async () => {
    for (const resource of allMethodsResources) {
      const data = await createResource(resource, cookie);
      const url = getUrl(resource) + '/' + data.id;
      const deleteRes = await axios.delete(url);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.data).toMatchObject({ message: 'success' });
    }
  });

  test('upload', async () => {
    for (const {
      name: resource,
      postfixPath,
      imageField,
    } of resourcesWithUploads) {
      const data = await createResource(resource, cookie);
      const url = getUrl(resource) + '/' + data.id + '/' + postfixPath;

      const form = new FormData();
      const filepath = path.resolve(ROOT_PATH, 'tmp', 'image.jpg');
      form.append(imageField, fs.createReadStream(filepath));
      const uploadRes = await axios.post(url, form, {
        headers: form.getHeaders(),
      });

      expect(uploadRes.status).toBe(202);
      expect(uploadRes.data).toMatchObject({ message: 'uploading' });
    }
  });
});
