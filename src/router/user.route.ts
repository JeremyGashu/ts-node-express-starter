import { Router } from "express";
import UserCtrl from "../controller/user.controller";
import { TypeValidator } from "../validators";
import { SUserSchema, } from "../types/users";
import { Prisma } from "@prisma/client";
const TValidator = new TypeValidator<Prisma.UserCreateInput>();
class UserRoute {
  router = Router();
  userController = new UserCtrl();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // GET ALL users - api/users
    // [GET]
    this.router.route("/").get(this.userController.GetAllUsers);
    
    this.router
      .route("/")
      .post(
        TValidator.validate(SUserSchema),
        this.userController.CreateNewUser
      );
  }
}
export default new UserRoute().router;
