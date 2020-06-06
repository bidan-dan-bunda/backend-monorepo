import express from 'express';
import authRouter from './auth';

import * as locationRouter from './resources/location';
import * as userRouter from './resources/user';
import * as puskesmasRouter from './resources/puskesmas';
import * as videomateriRouter from './resources/videomateri';
import * as videoRouter from './resources/video';

import { createResourceRouter } from '../resource-route';
import { paging } from '../middlewares';

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);

// resources api
apiRouter.use(paging);
apiRouter.use('/locations', createResourceRouter(locationRouter, 'locations'));
apiRouter.use('/users', createResourceRouter(userRouter, 'users'));
apiRouter.use('/puskesmas', createResourceRouter(puskesmasRouter, 'puskesmas'));
apiRouter.use(
  '/videomateri',
  createResourceRouter(videomateriRouter, 'videomateri')
);
apiRouter.use('/video', createResourceRouter(videoRouter, 'video'));

export default apiRouter;
