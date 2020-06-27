import createError from 'http-errors';
import * as HttpStatusCodes from 'http-status-codes';
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import logger from 'morgan';
import session from './auth/session';
import unless from 'express-unless';

import Database from './orm/database';
Database.initializeModels();

import apiRouterV1 from './api/v1/index';
import { authenticateV1 } from './auth/middleware';

const app = express();

/* == TODOS == */
// -> Better REST API routes handling
// -> Create rate-limiting middleware
// -> Create REST API security middlewares
// -> Improve session management

app.get('/ping', (req, res) => {
  return res.send('pong');
});

app.use(logger('dev'));
app.use(helmet());
app.use(express.json({ limit: '5MB' }));
app.use(cookieParser());

// session
app.use(session);

(authenticateV1 as any).unless = unless;
app.use(
  (authenticateV1 as any).unless({
    path: [
      { url: '/api/v1/auth/signin', methods: ['POST'] },
      { url: '/api/v1/auth/signup', methods: ['POST'] },
      { url: '/api/v1/auth/signout', methods: ['POST'] },
      { url: /api\/v1\/puskesmas\/tokens\/[A-Z0-9]+/, methods: ['GET'] },
      { url: /api\/v1\/users\/[A-Za-z_0-9.]+/, methods: ['GET'] },
    ],
  })
);

app.use('/api/v1', apiRouterV1);

app.use((req, res, next) => {
  return next(createError(404));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(err.status || 500).json({
    error_code: err?.code,
    error_message: err?.message || HttpStatusCodes.getStatusText(err.code),
    error_details: err?.details,
  });
});

export default app;
