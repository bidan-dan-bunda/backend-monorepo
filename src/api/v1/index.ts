import express from 'express';

import * as authRouter from './auth';
import * as locationRouter from './resources/location';
import * as userRouter from './resources/user';
import * as puskesmasRouter from './resources/puskesmas';
import * as videomateriRouter from './resources/videomateri';
import * as videoRouter from './resources/video';

import { createResourceRouter } from '../resource-route';
import { paging } from '../middleware';

const apiRouter = express.Router();

apiRouter.get('/', (req, res) => {
  return res.json({ message: 'Hello :)' });
});

apiRouter.use('/auth', createResourceRouter(authRouter));

// resources api
apiRouter.use(paging);
apiRouter.use('/locations', createResourceRouter(locationRouter));
apiRouter.use('/users', createResourceRouter(userRouter));
apiRouter.use('/puskesmas', createResourceRouter(puskesmasRouter));
apiRouter.use('/videomateri', createResourceRouter(videomateriRouter));
apiRouter.use('/videos', createResourceRouter(videoRouter));

export default apiRouter;
