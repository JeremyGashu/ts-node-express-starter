import { Router } from 'express';
import UserCtrl from '../controller/user.controller';
import { TypeValidator } from '../validators';
import { SUserCreateSchema, SUserUpdateSchema } from '../types/schema/users';
import { Prisma } from '@prisma/client';
const TValidator = new TypeValidator<Prisma.UserCreateInput>();
class UserRoute {
  router = Router();
  userController = new UserCtrl();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // GET ALL USERS - api/users
    // [GET]
    this.router.route('/').get(this.userController.GetAllUsers);

    // POST CREATE NEW USER - api/users
    // [POST]
    this.router
      .route('/')
      .post(
        TValidator.validate(SUserCreateSchema),
        this.userController.CreateNewUser,
      );

    // DELETE EXISTING USER - api/users/:id
    // [GET]
    this.router.route('/:id').delete(this.userController.DeleteUser);

    // PATCH UPDATE EXISTING USER - api/users/:id
    // [PATCH]
    this.router
      .route('/:id')
      .patch(
        TValidator.validate(SUserUpdateSchema),
        this.userController.UpdateUser,
      );
  }
}
export default new UserRoute().router;
