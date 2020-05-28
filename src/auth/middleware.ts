import { Request, Response, NextFunction } from 'express';

export function auth(req: Request, res: Response, next: NextFunction) {
  if (req.session?.isLoggedIn) {
    return next();
  }
  return res.status(401).json({
    status: 401,
    message: 'unauthorized',
    data: null,
  });
}
