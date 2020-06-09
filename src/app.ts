import * as HttpStatusCodes from 'http-status-codes';
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import logger from 'morgan';
import session from './auth/session';

import Database from './orm/database';
Database.initializeModels();

import apiRouterV1 from './api/v1/index';
import apiRouterV2 from './api/v2/index';

const app = express();

/* == TODOS == */
// -> Better REST API routes handling
// -> Create rate-limiting middleware
// -> Create REST API security middlewares
// -> Improve session management

app.use(logger('dev'));
app.use(helmet());
app.use(express.json({ limit: '5MB' }));
app.use(cookieParser());

// session
app.use(session);

app.use('/api/v1', apiRouterV1);
// app.use('/api/v2', apiRouterV2);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(err.status || 500).json({
    code: err.code,
    message: err.message || HttpStatusCodes.getStatusText(err.code),
    details: err.details,
  });
});

export default app;
