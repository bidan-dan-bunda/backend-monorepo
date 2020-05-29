import express from 'express';
import authRouter from './auth';
import * as locationRouter from './resources/location';
import { createResourceRouter } from '../resource-route';
import { paging } from '../middlewares';

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);

// resources api
apiRouter.use(paging);
apiRouter.use('/locations', createResourceRouter(locationRouter));

export default apiRouter;
