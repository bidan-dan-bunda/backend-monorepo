import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import sessionConfig from './auth/session';

import Database from './orm/database';
Database.initializeModels();

import apiRouter from './api/v1/index';

const app = express();

/* == TODOS == */
// -> Better REST API routes handling
// -> Create rate-limiting middleware
// -> Create REST API security middlewares
// -> Improve session management

app.use(logger('dev'));
app.use(helmet());
app.use(express.json({ limit: '5MB' }));
app.use(sessionConfig);

app.use('/api/v1', apiRouter);

export default app;
