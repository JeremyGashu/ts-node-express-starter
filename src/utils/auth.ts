import PClient, { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { TUserAuth } from '../types/typedef/auth';

const prisma = new PClient.PrismaClient();

// Usually I keep the token between 5 minutes - 30 minutes
export const generateAccessToken = (user: User): string => {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: '30m',
    },
  );
};

// I choosed 8h because i prefer to make the user login again each day.
// But keep him logged in if he is using the app.
// You can change this value depending on your app logic.
// I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
export const generateRefreshToken = (user: User, jti: string): string => {
  return jwt.sign(
    {
      userId: user.id,
      jti,
    },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: '8h',
    },
  );
};

export const generateTokens = (user: User, jti: string): TUserAuth => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
};

export const hashToken = (jti: string): string => {
  return crypto.createHash('sha512').update(jti).digest('hex');
};

// used when we create a refresh token.
export const addRefreshTokenToWhitelist = (
  jti: string,
  refreshToken: string,
  userId: string,
) => {
  return prisma.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
};

// used to check if the token sent by the client is in the database.
export const findRefreshTokenById = (id: string) => {
  return prisma.refreshToken.findUnique({
    where: {
      id,
    },
  });
};

// soft delete tokens after usage.
export const deleteRefreshToken = (id: string) => {
  return prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
};

export const revokeTokens = (userId: string) => {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
};
