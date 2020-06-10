import { allMethodsResources } from './constants';
import {
  getSchemaForGenerator,
  generateData,
  reqToResourceUrl,
  resourceUrl,
  req,
  signup,
  authActionUrl,
  reqWithSessionCookies,
} from './utils';

describe('authorization', () => {
  describe('admin should be able to do anything (all CRUD operations)', () => {
    test('should be able see data', async () => {
      for (const resource of allMethodsResources) {
        const schema = getSchemaForGenerator(resource);
        if (schema) {
          const data = generateData(schema);
          const createRes = await reqToResourceUrl({ resource, body: data });
          const resourceId = createRes.data.data.id;
          const getRes = await reqToResourceUrl({
            resource,
            urlPostfix: resourceId,
            method: 'get',
          });
          expect(getRes.status).toBe(200);
        }
      }
    });

    test('should be able to create data', async () => {
      for (const resource of allMethodsResources) {
        const schema = getSchemaForGenerator(resource);
        if (schema) {
          const data = generateData(schema);
          const res = await reqToResourceUrl({ resource, body: data });
          expect(res.status).toBe(201);
        }
      }
    });

    test('should be able to edit data', async () => {
      for (const resource of allMethodsResources) {
        const schema = getSchemaForGenerator(resource);
        if (schema) {
          const data = generateData(schema);
          const postRes = await reqToResourceUrl({ resource, body: data });
          const resourceId = postRes.data.data.id;
          const putRes = await reqToResourceUrl({
            resource,
            urlPostfix: resourceId,
            method: 'put',
            body: data,
          });
          expect(putRes.status).toBe(200);
        }
      }
    });

    test('should be able to destroy data', async () => {
      for (const resource of allMethodsResources) {
        const schema = getSchemaForGenerator(resource);
        if (schema) {
          const data = generateData(schema);
          const postRes = await reqToResourceUrl({ resource, body: data });
          const resourceId = postRes.data.data.id;
          const deleteRes = await reqToResourceUrl({
            resource,
            urlPostfix: resourceId,
            method: 'delete',
            body: data,
          });
          expect(deleteRes.status).toBe(200);
        }
      }
    });
  });

  describe('unauthorized users should not be able to do anything (all CRUD operations)', () => {
    test('should not be able see data', async () => {
      for (const resource of allMethodsResources) {
        const schema = getSchemaForGenerator(resource);
        if (schema) {
          const data = generateData(schema);
          const createRes = await reqToResourceUrl({ resource, body: data });
          const resourceId = createRes.data.data.id;
          const getRes = await req({
            url: resourceUrl(resource) + '/' + resourceId,
            method: 'get',
          });
          expect(getRes.status).toBe(401);
        }
      }
    });

    test('should not be able to create data', async () => {
      for (const resource of allMethodsResources) {
        const schema = getSchemaForGenerator(resource);
        if (schema) {
          const data = generateData(schema);
          const res = await req({
            url: resourceUrl(resource),
            method: 'post',
            body: data,
          });
          expect(res.status).toBe(401);
        }
      }
    });

    test('should not be able to edit data', async () => {
      for (const resource of allMethodsResources) {
        const schema = getSchemaForGenerator(resource);
        if (schema) {
          const data = generateData(schema);
          const postRes = await reqToResourceUrl({ resource, body: data });
          const resourceId = postRes.data.data.id;
          const putRes = await req({
            url: resourceUrl(resource) + '/' + resourceId,
            method: 'put',
            body: data,
          });
          expect(putRes.status).toBe(401);
        }
      }
    });

    test('should not able to destroy data', async () => {
      for (const resource of allMethodsResources) {
        const schema = getSchemaForGenerator(resource);
        if (schema) {
          const data = generateData(schema);
          const postRes = await reqToResourceUrl({ resource, body: data });
          const resourceId = postRes.data.data.id;
          const deleteRes = await req({
            url: resourceUrl(resource) + '/' + resourceId,
            method: 'put',
            body: data,
          });
          expect(deleteRes.status).toBe(401);
        }
      }
    });
  });

  describe('regulars users should be able to see data and only be able to modify its profile ', () => {
    const userSchema = getSchemaForGenerator('users');
    const userData = generateData(userSchema);
    let userId: number;
    let cookie = '';
    beforeEach(async () => {
      await signup(userData);
      const loginRes = await req({
        url: authActionUrl('signin'),
        method: 'post',
        body: { username: userData.username, password: userData.password },
      });
      userId = loginRes.data.data.user_id;
      cookie = loginRes.headers['set-cookie'][0];
    });

    test('should be able see data', async () => {
      for (const resource of allMethodsResources) {
        const schema = getSchemaForGenerator(resource);
        if (schema) {
          const data = generateData(schema);
          const createRes = await reqToResourceUrl({ resource, body: data });
          const resourceId = createRes.data.data.id;
          const getRes = await reqWithSessionCookies({
            cookie,
            url: resourceUrl(resource) + '/' + resourceId,
            method: 'get',
          });
          expect(getRes.status).toBe(200);
        }
      }
    });

    test('should be able to edit its own profile', async () => {
      const data = generateData(userSchema);
      const getRes = await reqWithSessionCookies({
        cookie,
        url: resourceUrl('users') + '/' + userId,
        method: 'put',
        body: data,
      });
      expect(getRes.status).toBe(200);
    });

    test('should not be able to create data', async () => {
      for (const resource of allMethodsResources) {
        const schema = getSchemaForGenerator(resource);
        if (schema) {
          const data = generateData(schema);
          const res = await reqWithSessionCookies({
            cookie,
            url: resourceUrl(resource),
            method: 'post',
            body: data,
          });
          expect(res.status).toBe(403);
        }
      }
    });

    test('should not be able to edit data', async () => {
      for (const resource of allMethodsResources) {
        const schema = getSchemaForGenerator(resource);
        if (schema) {
          const data = generateData(schema);
          const postRes = await reqToResourceUrl({ resource, body: data });
          const resourceId = postRes.data.data.id;
          const putRes = await reqWithSessionCookies({
            cookie,
            url: resourceUrl(resource) + '/' + resourceId,
            method: 'put',
            body: data,
          });
          expect(putRes.status).toBe(403);
        }
      }
    });

    test('should not able to destroy data', async () => {
      for (const resource of allMethodsResources) {
        const schema = getSchemaForGenerator(resource);
        if (schema) {
          const data = generateData(schema);
          const postRes = await reqToResourceUrl({ resource, body: data });
          const resourceId = postRes.data.data.id;
          const deleteRes = await reqWithSessionCookies({
            cookie,
            url: resourceUrl(resource) + '/' + resourceId,
            method: 'put',
            body: data,
          });
          expect(deleteRes.status).toBe(403);
        }
      }
    });
  });
});
