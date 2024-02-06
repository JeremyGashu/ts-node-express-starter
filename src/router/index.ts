import { Application } from 'express';
import userRoute from './user.route';
import authRoute from './auth.route';

export const initAllAppRoutes = (app: Application) => {
  // User routes
  app.use('/api/users', userRoute);
  //   Authentication routes
  app.use('/api/auth', authRoute);
};
