import PClient, { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { TUserAuth } from '../types/typedef/auth';
import 'dotenv/config';

const prisma = new PClient.PrismaClient();
class AuthRepo {
  /**
   * @description: Generated new access token from user object with id.
   * Usually keep the token between 5 minutes - 30 minutes
   * @params: id as number
   * @role: -
   */
  GenerateAccessToken = (user: User): string => {
    return jwt.sign(
      { userId: user.id },
      process.env.JWT_ACCESS_SECRET as string,
      {
        expiresIn: '15m',
      },
    );
  };
  /**
   * @description I choosed 8h because it is prefered to make the user login again each day.
   * But keep him logged in if he is using the app.
   * You can change this value depending on your app logic.
   * I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
   */
  GenerateRefreshToken = (user: User, tokenId: string): string => {
    return jwt.sign(
      {
        userId: user.id,
        tokenId,
      },
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: '8h',
      },
    );
  };
  /**
   * @description: Generated new refresh token from
   * user access token which is not expired.
   * Usually keep the token between 5 minutes - 30 minutes
   * @params: id as string which is the user id
   * @role: -
   */
  GenerateTokens = (user: User, tokenId: string): TUserAuth => {
    const accessToken = this.GenerateAccessToken(user);
    const refreshToken = this.GenerateRefreshToken(user, tokenId);

    return {
      accessToken,
      refreshToken,
    };
  };
  /**
   * @description: Used to hash the user token
   * @params: token id
   * @role: -
   */
  HashToken = (tokenId: string): string => {
    return crypto.createHash('sha512').update(tokenId).digest('hex');
  };

  /**
   * @description: Adds the token to granted token list in the database
   * @params: token, refreshToken and the userId as string values
   * @role: -
   */
  AddRefreshTokenToWhitelist = (
    tokenId: string,
    refreshToken: string,
    userId: string,
  ) => {
    return prisma.refreshToken.create({
      data: {
        id: tokenId,
        hashedToken: this.HashToken(refreshToken),
        userId,
        revoked: false,
      },
    });
  };

  /**
   * @description: Gets the refresh token by the registered id from database
   * @params: refresh token id
   * @role: -
   */
  FindRefreshTokenById = (id: string) => {
    return prisma.refreshToken.findUnique({
      where: {
        id,
      },
    });
  };

  /**
   * @description: Revokes the permission from the refresh token, not delete,
   * just change the status from revoked: false to revoked:true.
   * @params: refresh token id
   * @role: -
   */
  DeleteRefreshToken = (id: string) => {
    return prisma.refreshToken.update({
      where: {
        id,
      },
      data: {
        revoked: true,
      },
    });
  };
  /**
   * @description: Revokes the permission from the refresh token, not delete,
   * just change the status from revoked: false to revoked:true.
   * Which is during logout user, to revoke all tokens the user owns.
   * @params: user id
   * @role: -
   */
  RevokeTokens = (userId: string) => {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
      },
      data: {
        revoked: true,
      },
    });
  };
}

export default new AuthRepo();
