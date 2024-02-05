import { Request, Response,} from "express";
import userRepo from "../repository/user.repo";

export default class UserCtrl {
  constructor() {}

  /*
    returns all users
  */
  GetAllUsers = async (
    req: Request,
    res: Response,
  ) => {
    userRepo.GetAllUsers()
      .then((users) => {
        res.status(200).json({
          success: true,
          users: users,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          errors: ["Internal Server Error."],
        });
      });
  };

  /*
    creates new user record
  */
  CreateNewUser = async (req: Request, res: Response) => {
    
    userRepo.CreateNewUsers(req.body)
      .then((user) => {
        if (user) {
          return res.status(200).json({
            success: true,
            user,
          });
        }
        res.status(422).json({
          success: false,
          errors: ["Failed to create user."],
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          errors: ["Internal Server Error.", err],
        });
      });
  };
  
}
