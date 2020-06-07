import { Request, Response, NextFunction } from 'express';

export interface ResourcePage {
  offset: number;
  limit: number;
}

export function paging(req: Request, res: Response, next: NextFunction) {
  const data = (res as any).locals.page || {};

  const { page: _page = 1, page_size: _page_size = 10 } = Object.assign(
    {},
    req.body,
    req.query
  );
  const page = Math.max(_page, 1);
  const pageSize = Math.max(0, Math.min(_page_size, 100));

  data.offset = page * pageSize - (pageSize - 1) - 1;
  data.limit = pageSize;
  (res as any).locals.page = data;
  return next();
}

// export function validate
