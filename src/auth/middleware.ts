import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';

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

export function authorize(compareFn: Function) {
  return async function (req: Request, res: Response, next: NextFunction) {
    if (compareFn(req)) {
      return next();
    }

    return next(createError(403));
  };
}

/* passport.use(
  new Strategy((username, password, done) => {
    return signin({ username, password })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  })
);
 */
