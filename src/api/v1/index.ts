import express from 'express';

import * as authRouter from './auth';
import * as locationRouter from './resources/location';
import * as userRouter from './resources/user';
import * as puskesmasRouter from './resources/puskesmas';
import * as videomateriRouter from './resources/videomateri';
import * as videoRouter from './resources/video';
import * as devicesRouter from './resources/devicetokens';
import * as chatRouter from './resources/chat';
import * as puskesmasTokenRouter from './resources/puskesmas-token';
import * as vaccineRouter from './resources/vaccine';
import * as chatGroupRouter from './resources/chatgroup';
import * as patientRouter from './resources/patient';
import * as accountRouter from './resources/account';

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
apiRouter.use('/account', createResourceRouter(accountRouter));
apiRouter.use('/puskesmas', createResourceRouter(puskesmasRouter));
apiRouter.use('/videomateri', createResourceRouter(videomateriRouter));
apiRouter.use('/videos', createResourceRouter(videoRouter));
apiRouter.use('/devices', createResourceRouter(devicesRouter));
apiRouter.use('/chats', createResourceRouter(chatRouter));
apiRouter.use('/puskesmas-tokens', createResourceRouter(puskesmasTokenRouter));
apiRouter.use('/vaccines', createResourceRouter(vaccineRouter));
apiRouter.use('/chatgroups', createResourceRouter(chatGroupRouter));
apiRouter.use('/patients', createResourceRouter(patientRouter));

export default apiRouter;
