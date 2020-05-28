import session from 'express-session';
import sessionSequelize from 'connect-session-sequelize';
import { getSequelizeInstance } from '../orm/database';

const isProduction = process.env.NODE_ENV == 'production';
const isHttps = (isProduction && process.env.HTTPS_ENABLED) as boolean;
const useBetterStore = process.env.USE_BETTER_STORE || isProduction;

const SequelizeStore = sessionSequelize(session.Store);
const store = new SequelizeStore({
  db: getSequelizeInstance(),
});
store.sync();

// express-session configuration
export default session({
  store: useBetterStore && store,
  secret: process.env.SESSION_SECRET as string,
  cookie: {
    secure: isHttps,
    httpOnly: true,
  },
});
