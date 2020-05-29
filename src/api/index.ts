import express from 'express';
import authRouter from './auth.v1';
import * as locationRouter from './resources/v1/location';
import { createResourceRouter } from './resource-route';
import { paging } from './middlewares';

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);

// resources api
apiRouter.use(paging);
apiRouter.use('/locations', createResourceRouter(locationRouter));

export default apiRouter;
