import { Request, Response } from 'express';
import userRepo from '../repository/user.repo';
import { Prisma, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  excludeFieldFromListOfObject,
  excludeFieldFromSingleObject,
} from '../utils/exclude';
import authRepo from '../repository/auth.repo';

export default class UserCtrl {
  /*
    returns all users
  */
  GetAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await userRepo.GetAllUsers();
      res.status(200).json({
        success: true,
        users: excludeFieldFromListOfObject(users, 'password'),
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
      const email: string = req.body.email;
      const userExists = await userRepo.GetUserByEmail(email);
      if (userExists) {
        return res.status(422).json({
          success: false,
          errors: ['User already registered with this Email!'],
        });
      }
      const user = await userRepo.CreateNewUsers(req.body);
      if (user) {
        const tokenId = randomUUID();
        const { accessToken, refreshToken } = authRepo.GenerateTokens(
          user,
          tokenId,
        );
        console.log('******access token****', accessToken);
        await authRepo.AddRefreshTokenToWhitelist(
          tokenId,
          refreshToken,
          user.id,
        );

        return res.status(200).json({
          success: true,
          user: excludeFieldFromSingleObject(user, 'password'),
          auth: { accessToken, refreshToken },
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

    try {
      await userRepo.DeleteUser(id);
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

    try {
      const user: User = await userRepo.UpdateUser(
        id,
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
