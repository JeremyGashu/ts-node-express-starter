import { Application } from 'express';
import userRoute from './user.route';
import authRoute from './auth.route';

export const initAllAppRoutes = (app: Application) => {
  app.use('/api/users', userRoute);
  app.use('/api/auth', authRoute);
};
