import { Router } from "express";
import UserCtrl from "../controller/user.controller";
import { TypeValidator } from "../validators";
import { SUserSchema, TUser } from "../types/users";
const TValidator = new TypeValidator<TUser>();
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
