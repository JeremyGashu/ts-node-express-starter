import { Router } from 'express';
import { TypeValidator } from '../validators';
import { Prisma } from '@prisma/client';
import AuthController from '../controller/auth.controller';

import { SUserLoginSchema } from '../types/schema/auth';
const TValidator = new TypeValidator<Prisma.UserCreateInput>();
class AuthRoute {
  router = Router();
  authController = new AuthController();
  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // POST LOGINS USER - api/auth
    // [POST]
    this.router
      .route('/login')
      .post(
        TValidator.validate(SUserLoginSchema),
        this.authController.LoginUser,
      );

    //  POST REFRESH TOKEN - api/auth
    // [POST]
    this.router.route('/refreshToken').post(this.authController.RefreshToken);
    //  POST REVOKES TOKENS - api/auth
    // [POST]
    this.router
      .route('/revokeRefreshTokens')
      .post(this.authController.RevokeRefreshToken);
  }
}
export default new AuthRoute().router;
