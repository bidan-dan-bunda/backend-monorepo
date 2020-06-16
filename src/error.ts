import { Request, Response, NextFunction } from 'express';

export function reportError(...err: any) {
  console.error(...err);
}
