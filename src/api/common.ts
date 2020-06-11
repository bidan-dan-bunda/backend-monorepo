import { ObjectSchema } from '@hapi/joi';
import { DEFAULT_UPLOAD_PATH } from './../constants';
import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import { MAX_UPLOAD_FILE_SIZE } from './constants';
import Database from '../orm/database';
import { CountOptions } from 'sequelize/types';

export function validateRequest(schema: ObjectSchema) {
  return function (req: Request) {
    const { error, value } = schema.validate(req.body);
    if (error) {
      throw error;
    }
    return null;
  };
}

export function createMulterMiddleware(destLastPart: string) {
  return multer({
    dest: path.resolve(DEFAULT_UPLOAD_PATH, destLastPart),
    limits: { fileSize: MAX_UPLOAD_FILE_SIZE },
  });
}

export async function countPages(
  db: Database<any>,
  pageSize: number,
  locals: any,
  countOptions?: CountOptions
) {
  const count = await db.model.count(countOptions);
  locals.page.pages = Math.ceil(count / pageSize);
}
