import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import get from 'lodash/get';
import { verifyToken } from './token';

export async function authenticateWithToken(req: Request) {
  let authorizationHeader;
  if ((authorizationHeader = req.headers['authorization'])) {
    let token = authorizationHeader.split(' ')[1];
    if (token) {
      try {
        const decodedToken = await verifyToken(token);
        return decodedToken;
      } catch (err) {
        return;
      }
    } else {
      return;
    }
  } else {
    return;
  }
}

export async function authenticateV1(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let decodedToken: object | undefined;
  if ((decodedToken = await authenticateWithToken(req))) {
    req.user = { ...req.user, admin: true };
    return next();
  }

  if (req.session?.user) {
    return next();
  }

  return next(createError(401));
}

export function authorize(compareFn: Function) {
  return async function (req: Request, res: Response, next: NextFunction) {
    if ((req.user as any)?.admin || compareFn(req)) {
      return next();
    }

    return next(createError(403));
  };
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

export function isAdminFn() {
  return function (req: Request) {
    return (req.user as any)?.admin;
  };
}

// pre-initialized middlewares
export const isAdmin = authorize(isAdminFn());
