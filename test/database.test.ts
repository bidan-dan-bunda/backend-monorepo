import User, { UserModel } from '../src/orm/models/user';
import Database from '../src/orm/database';

const database = new Database<UserModel>(User, undefined);

beforeEach(async () => {
  await database.model.truncate();
});

it('should fetch correct user data', async () => {
  let data = await database.load();
  expect(data.length).toBe(0);
  await database.model.create({
    user_type: 'b',
    username: 'bagaswh',
    password: 'sianjeg',
    name: 'Bagas Wahyu Hidayah',
    address: 'Pakem, Harjobinangun, Pakem, Sleman',
    telephone: 89121313,
  });
  data = await database.load();
});
