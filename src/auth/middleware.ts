import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import get from 'lodash/get';

export function authenticateV1(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session?.id) {
    return next();
  }
  return next(createError(401));
}

// compare functions
export function isUserType(userType: string) {
  return function (req: Request) {
    return req.session?.user?.user_type == userType;
  };
}

export function isOwningUser(path: string) {
  return function (req: Request) {
    return req.session?.user?.id == get(req, path);
  };
}

export function authorize(compareFn: Function) {
  return async function (req: Request, res: Response, next: NextFunction) {
    if (compareFn(req)) {
      return next();
    }

    return next(createError(403));
  };
}
