import { NextFunction, Request, Response } from 'express';
import userRepo from '../repository/user.repo';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import 'dotenv/config';
import authRepo from '../repository/auth.repo';
export default class AuthCtrl {
  /*
    Logins user to the system and sends tokens back to the user
  */
  LoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          errors: ['Please provide Email and Password!'],
        });
      }

      const existingUser = await userRepo.GetUserByEmail(email);

      if (!existingUser) {
        return res.status(401).json({
          success: false,
          errors: ['Invalid login credentials.'],
        });
      }

      const validPassword = await bcrypt.compare(
        password,
        existingUser.password,
      );
      if (!validPassword) {
        return res.status(401).json({
          success: false,
          errors: ['Invalid login credentials.'],
        });
      }

      const tokenId = randomUUID();
      const { accessToken, refreshToken } = authRepo.GenerateTokens(
        existingUser,
        tokenId,
      );
      await authRepo.AddRefreshTokenToWhitelist(
        tokenId,
        refreshToken,
        existingUser.id,
      );

      return res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  };

  /*
    Refreshes registered user token receiving refresh token of previously logged in user
  */
  RefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          errors: ['Missing refresh token!'],
        });
      }
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      ) as JwtPayload;
      const savedRefreshToken = await authRepo.FindRefreshTokenById(
        payload.tokenId as string,
      );

      if (!savedRefreshToken || savedRefreshToken.revoked === true) {
        return res.status(401).json({
          success: false,
          errors: ['Unauthorized!'],
        });
      }

      const hashedToken = authRepo.HashToken(refreshToken);
      if (hashedToken !== savedRefreshToken.hashedToken) {
        return res.status(401).json({
          success: false,
          errors: ['Unauthorized!'],
        });
      }

      const user = await userRepo.GetUserById(payload.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          errors: ['Unauthorized!'],
        });
      }

      await authRepo.DeleteRefreshToken(savedRefreshToken.id);
      const tokenId = randomUUID();
      const { accessToken, refreshToken: newRefreshToken } =
        authRepo.GenerateTokens(user, tokenId);
      await authRepo.AddRefreshTokenToWhitelist(
        tokenId,
        newRefreshToken,
        user.id,
      );

      return res.status(200).json({
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      next(err);
    }
  };

  /*
    Revokes all refresh tokens of a user
  */
  RevokeRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } = req.body;
      await authRepo.RevokeTokens(userId);
      res
        .status(200)
        .json({ message: `Tokens revoked for user with id #${userId}` });
    } catch (err) {
      next(err);
    }
  };
}
