import Database from '../src/orm/database';
import {
  DeviceToken,
  DeviceTokenDefinition,
} from '../src/orm/models/devicetokens';
import { notify } from '../src/core/services/notifier';

const deviceTokenDb = new Database<DeviceToken>(DeviceTokenDefinition);

async function sendNotification() {
  const deviceTokens = (
    await deviceTokenDb.load({ attributes: ['token'] })
  ).map((dt) => dt.token);
  notify(deviceTokens, {
    title: 'Aplikasi sedang dalam perbaikan',
    body: 'Tolong clear app data Anda dan login ulang',
  });
}

sendNotification();
