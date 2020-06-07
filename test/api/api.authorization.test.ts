import { ObjectSchemaForGenerator } from './schema';
import { generateDummyData } from '../utils';
import axios from 'axios';
import { apiUrl, bidanOnlyResources } from './constants';
import { login, signup, createUser } from './utils';

const user1 = generateDummyData(ObjectSchemaForGenerator.user);
const user2 = generateDummyData(ObjectSchemaForGenerator.user);

function createBidan() {
  return createUser('b');
}

jest.setTimeout(50000);

describe('should authorize request for action on resources', () => {
  describe('users resource', () => {
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
        const userId = loginRes.data.user_id;

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

  describe('bidan-related resources', () => {
    test('bidan (and only bidan) should be able to create and edit videomateri, video, and', async () => {
      try {
        const bidan1 = createBidan();
        const bidan2 = createBidan();
        const bidan3 = createBidan();

        await Promise.all([signup(bidan1), signup(bidan2), signup(bidan3)]);

        const loginRes = await login(bidan1);
        const cookies = loginRes.headers['set-cookie'];

        for (const resource of bidanOnlyResources) {
          // create
          const resourceData1 = generateDummyData(
            ObjectSchemaForGenerator[resource]
          );
          const url = apiUrl + '/' + resource;
          const res1 = await axios.post(url, resourceData1, {
            headers: { cookie: cookies[0] },
          });

          // edit
          const resourceData2 = generateDummyData(
            ObjectSchemaForGenerator[resource]
          );
          await axios.put(url + '/' + res1.data.id, resourceData2, {
            headers: { cookie: cookies[0] },
          });

          let threw = false;
          const nonBidanUser = createUser('u');
          await signup(nonBidanUser);

          const nonBidanLoginRes = await login(nonBidanUser);
          const nonBidanCookie = nonBidanLoginRes.headers['set-cookie'][0];
          try {
            const resourceData3 = generateDummyData(
              ObjectSchemaForGenerator[resource]
            );
            await axios.put(url + '/' + res1.data.id, resourceData3, {
              headers: { cookie: nonBidanCookie },
            });
          } catch (err) {
            threw = true;
            expect(err.response.status).toBe(403);
          }

          if (!threw) {
            throw new Error('Request did not throw');
          }
        }
      } catch (err) {
        throw err;
      }
    });
  });
});
