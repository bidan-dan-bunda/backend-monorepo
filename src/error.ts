import { Request, Response, NextFunction } from 'express';

export function handleBadRequest(req: Request, res: Response) {
  return res.status(400);
}
