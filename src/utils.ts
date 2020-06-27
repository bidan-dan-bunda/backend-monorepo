import isPromise from 'is-promise';
import retry from 'retry';

export type GenericFunc = (...params: any[]) => Promise<any> | any;

export function toArray(thing: any) {
  if (!thing || Array.isArray(thing)) {
    return thing;
  }
  return [thing];
}

export function retryOperation<T = any>(
  fn: any,
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
        let err = e;
        if (operation.retry(err)) {
          return;
        }
      }
      reject(err);
    });
  });
}
