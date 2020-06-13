import { ObjectSchema } from '@hapi/joi';
import { DEFAULT_UPLOAD_PATH } from './../constants';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { MAX_UPLOAD_FILE_SIZE } from './constants';
import Database from '../orm/database';
import { CountOptions } from 'sequelize/types';

export function validateRequest(schema: ObjectSchema) {
  return function (req: Request) {
    const { error, value } = schema.validate(req.body, { convert: true });
    if (error) {
      throw error;
    }
    req.body = value;
    return null;
  };
}

export function createMulterMiddleware(destLastPart: string) {
  return multer({
    dest: path.resolve(DEFAULT_UPLOAD_PATH, destLastPart),
    limits: { fileSize: MAX_UPLOAD_FILE_SIZE },
  });
}

export function countPages(db: Database<any>, countOptions?: CountOptions) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const count = await db.model.count(countOptions);
    const pageSize = res.locals.page.limit;
    res.locals.page.pages = Math.ceil(count / pageSize);
    return next();
  };
}
