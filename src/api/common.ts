import { DEFAULT_UPLOAD_PATH } from './../constants';
import { RequestBodyObjectSchema } from './schema';
import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import { MAX_UPLOAD_FILE_SIZE } from './constants';

export function validateRequest(
  resource: keyof typeof RequestBodyObjectSchema
) {
  return function (req: Request) {
    const schema = RequestBodyObjectSchema[resource];
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
