import { Request, Response } from 'express';
import userRepo from '../repository/user.repo';
import { Prisma, User } from '@prisma/client';

export default class UserCtrl {
  /*
    returns all users
  */
  GetAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await userRepo.GetAllUsers();
      res.status(200).json({
        success: true,
        users: users,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        errors: ['Internal Server Error.'],
      });
    }
  };

  /*
    creates new user record
  */
  CreateNewUser = async (req: Request, res: Response) => {
    try {
      const user = await userRepo.CreateNewUsers(req.body);
      if (user) {
        return res.status(200).json({
          success: true,
          user,
        });
      }
      res.status(422).json({
        success: false,
        errors: ['Failed to create user.'],
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        errors: ['Internal Server Error.', err],
      });
    }
  };

  /*
    delete user from database
  */
  DeleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({
        success: false,
        errors: ['User ID cannot be empty.'],
      });
    }
    if (isNaN(Number(id))) {
      return res.status(401).json({
        success: false,
        errors: ['User ID must be an integer number number!'],
      });
    }

    try {
      await userRepo.DeleteUser(Number(id));
      res.status(200).json({
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        errors: ['Could not find user!'],
      });
    }
  };

  /*
    Update existing user from database
  */
  UpdateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({
        success: false,
        errors: ['User ID cannot be empty.'],
      });
    }
    if (isNaN(Number(id))) {
      return res.status(401).json({
        success: false,
        errors: ['User ID must be an integer number number!'],
      });
    }

    try {
      const user: User = await userRepo.UpdateUser(
        Number(id),
        req.body as Prisma.UserUpdateInput,
      );
      res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        errors: ['Could not find user!'],
      });
    }
  };
}
