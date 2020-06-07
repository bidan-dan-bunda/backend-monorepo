import { User, UserDefinition } from '../src/orm/models/user';
import Database from '../src/orm/database';
import { truncate } from './utils';

const database = new Database<User>(UserDefinition, undefined);

beforeAll(async () => {
  await truncate('users');
});

it('should fetch correct user data', async () => {
  let data = await database.load();
  expect([0, 1]).toContain(data.length);
  await database.model.create({
    user_type: 'b',
    username: 'bagaswh',
    password: 'sianjeg',
    name: 'Bagas Wahyu Hidayah',
    full_address: 'Pakem, Harjobinangun, Pakem, Sleman',
    telephone: '089121313',
  });
  data = await database.load();
  expect(data.length).toBe(1);
});
