import { generateDummyData } from '../utils';
import axios from 'axios';
import { apiUrl, allMethodsResources } from './constants';
import { login, signup, createUser, requestWithToken } from './utils';
import { ObjectSchemaForGenerator } from './schema';

const user1 = generateDummyData(ObjectSchemaForGenerator.user);
const user2 = generateDummyData(ObjectSchemaForGenerator.user);

jest.setTimeout(50000);

describe('should authorize request for action on resources', () => {
  describe('users resource', () => {
    describe('admin should be able to do anything', () => {
      test('edit user', async () => {
        const userData = generateDummyData(ObjectSchemaForGenerator.user);
        const signupRes = await signup(userData);
        let userId = signupRes.data.data.user_id;

        const editUrl = `${apiUrl}/users/${userId}`;

        // new data
        const user3 = generateDummyData(ObjectSchemaForGenerator.user);

        const res = await requestWithToken(editUrl, 'put', user3);
        expect(res.status).toBe(200);
      });

      test('delete user', async () => {
        const userData = generateDummyData(ObjectSchemaForGenerator.user);
        const signupRes = await signup(userData);
        let userId = signupRes.data.data.user_id;

        const deleteUrl = `${apiUrl}/users/${userId}`;
        const res = await requestWithToken(deleteUrl, 'delete');
        expect(res.status).toBe(200);
      });

      test('create and edit videomateri, video, and create puskesmas', async () => {
        try {
          for (const resource of allMethodsResources) {
            // create
            const resourceData1 = generateDummyData(
              ObjectSchemaForGenerator[resource]
            );
            const url = apiUrl + '/' + resource;
            const res1 = await requestWithToken(url, 'post', resourceData1);
            expect(res1.status).toBe(201);

            // edit
            const resourceData2 = generateDummyData(
              ObjectSchemaForGenerator[resource]
            );
            const res2 = await requestWithToken(
              url + '/' + res1.data.data.id,
              'put',
              resourceData2
            );
            expect(res2.status).toBe(200);

            let threw = false;
            const nonAuthorizedUser = createUser('u');
            await signup(nonAuthorizedUser);

            const nonAuthorizedUserLoginRes = await login(nonAuthorizedUser);
            const nonAuthorizedUserCookie =
              nonAuthorizedUserLoginRes.headers['set-cookie'][0];
            try {
              const resourceData3 = generateDummyData(
                ObjectSchemaForGenerator[resource]
              );
              await axios.put(url + '/' + res1.data.data.id, resourceData3, {
                headers: { cookie: nonAuthorizedUserCookie },
              });
            } catch (err) {
              console.log(err.response.data);
              threw = true;
              expect(err.response.status).toBe(403);
            }

            if (!threw) {
              throw new Error('Request did not throw');
            }
          }
        } catch (err) {
          console.log(err);
          throw err;
        }
      });
    });

    test('register new users', async () => {
      try {
        await Promise.all([signup(user1), signup(user2)]);
      } catch (err) {
        console.log(err.response.data);
        throw err;
      }
    });

    test('should reject editing other user', async () => {
      const loginRes = await login(user2);
      const cookies = loginRes.headers['set-cookie'];

      const editUrl = `${apiUrl}/users/1`;

      // new data
      const user3 = generateDummyData(ObjectSchemaForGenerator.user);
      try {
        await axios.put(editUrl, user3, {
          headers: { cookie: cookies[0] },
        });
      } catch (err) {
        expect(err.response.status).toBe(403);
      }
    });

    test('should accept user editing its own profile', async () => {
      try {
        const loginRes = await login(user2);
        const cookies = loginRes.headers['set-cookie'];
        const userId = loginRes.data.data.user_id;

        const editUrl = `${apiUrl}/users/${userId}`;

        // new data
        const user3 = generateDummyData(ObjectSchemaForGenerator.user);
        await axios.put(editUrl, user3, {
          headers: { cookie: cookies[0] },
        });
      } catch (err) {
        console.log(err.response.data);
        throw err;
      }
    });
  });
});
