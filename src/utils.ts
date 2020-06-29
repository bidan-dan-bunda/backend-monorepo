import admin from 'firebase-admin';
import isPromise from 'is-promise';
import retry from 'retry';
import { log } from './logger';

export type GenericFunc = (...params: any[]) => Promise<any> | any;

export function toArray(thing: any) {
  if (!thing || Array.isArray(thing)) {
    return thing;
  }
  return [thing];
}

export function retryOperation<T = any>(
  fn: any,
  shouldContinueCb: (err: any) => boolean,
  operationOpts?: retry.OperationOptions
): Promise<T> {
  const operation = retry.operation({
    factor: 1,
    ...operationOpts,
  });
  return new Promise((resolve, reject) => {
    operation.attempt(async (curretAtempt) => {
      let err = null;
      try {
        const ret = fn();
        if (isPromise(ret)) {
          const val = await ret;
          resolve(val as T);
          return;
        }
        resolve(ret);
        return;
      } catch (e) {
        err = e;
        if (shouldContinueCb(err) && operation.retry(err)) {
          return;
        }
      }
      operation.stop();
      reject(err);
      return;
    });
  });
}

export function logFirebaseResponse(
  res:
    | admin.messaging.BatchResponse
    | admin.messaging.MessagingTopicManagementResponse,
  action?: string
) {
  const details =
    (res as admin.messaging.BatchResponse).responses ||
    (res as admin.messaging.MessagingTopicManagementResponse).errors;

  log(
    `${action || 'Sent message'} with ${res.failureCount} failures, ${
      res.successCount
    } success. Details: ${JSON.stringify(details)}`,
    ['fcm']
  );
}
