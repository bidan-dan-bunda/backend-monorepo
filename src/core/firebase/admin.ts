import * as admin from 'firebase-admin';
import { getConfig } from '../../config';

const GOOGLE_APPLICATION_CREDENTIALS = getConfig(
  'GOOGLE_APPLICATION_CREDENTIALS'
);

admin.initializeApp({
  credential: admin.credential.cert(GOOGLE_APPLICATION_CREDENTIALS),
});

export const firestore = admin.firestore();
export const messaging = admin.messaging();
