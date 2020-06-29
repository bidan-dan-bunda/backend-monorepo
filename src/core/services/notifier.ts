import { messaging } from './../firebase/admin';
import admin from 'firebase-admin';
import { logFirebaseResponse } from '../../utils';
import { reportError } from '../../error';

export function notify(
  deviceTokens: string[],
  payload: admin.messaging.NotificationMessagePayload
) {
  return messaging
    .sendMulticast({ notification: payload, tokens: deviceTokens })
    .then(logFirebaseResponse)
    .catch(reportError);
}
