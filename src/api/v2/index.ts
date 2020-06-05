import express from 'express';
import authRouter from './auth';

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);

// resources api

export default apiRouter;
