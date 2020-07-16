import { messaging } from './../firebase/admin';
import admin from 'firebase-admin';
import { logFirebaseResponse } from '../../utils';
import { reportError } from '../../error';
import Database from '../../orm/database';
import {
  Notification,
  NotificationDefinition,
} from '../../orm/models/notification';
import {
  DeviceToken,
  DeviceTokenDefinition,
} from '../../orm/models/devicetokens';

export interface NotifyOptions {
  save: boolean;
  userIds: number[];
  activityType?: string;
  title?: string;
  body?: string;
  objectType?: string;
  objectUrl?: string;
}

const notificationDb = new Database<Notification>(NotificationDefinition);

export function storeNotifications(userIds: string[], ...params: any) {
  return notificationDb.create();
}

export function notify(
  deviceTokens: string[],
  payload: admin.messaging.NotificationMessagePayload,
  options?: NotifyOptions
) {
  if (options?.save) {
    const userIds = new Set(options.userIds);
    const notifications = Array.from(userIds).map((userId) => ({
      receipt_id: userId,
      activity_type: options.activityType,
      timestamp: Date.now(),
      object_type: options.objectType,
      title: options.title || payload.title,
      body: options.body || payload.body,
      object_url: options.objectUrl,
    }));
    notificationDb.model.bulkCreate(notifications);
  }

  return messaging
    .sendMulticast({ notification: payload, tokens: deviceTokens })
    .then(logFirebaseResponse)
    .catch(reportError);
}

export function greetingNotification(userId: number, deviceToken?: string) {
  if (deviceToken) {
    return notify(
      [deviceToken],
      {
        title: 'Selamat datang di aplikasi Bidan dan Bunda',
      },
      {
        save: true,
        activityType: 'welcome',
        objectType: 'welcome',
        userIds: [userId],
      }
    );
  }
  return notificationDb.create({
    receipt_id: userId,
    activity_type: 'welcome',
    timestamp: Date.now(),
    object_type: 'welcome',
    title: 'Selamat datang di aplikasi Bidan dan Bunda',
  });
}
