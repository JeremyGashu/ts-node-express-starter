import PClient, { Prisma, User } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PClient.PrismaClient();

class UsersRepo {
  /**
    @description : Returns all users in the database
    @params: User
  */
  GetAllUsers = async (
    page: number = 1,
    limit: number = 10,
  ): Promise<User[]> => {
    page = page || 1;
    limit = limit || 10;
    return await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
  };

  /**
    @description: create new user record
    @params: Prisma.UserCreateInput
    @role: -
  */
  CreateNewUsers = async (user: Prisma.UserCreateInput): Promise<User> => {
    user.password = bcrypt.hashSync(user.password, 12);
    console.log('*****Hashed password****', user.password);
    const response: User = await prisma.user.create({ data: user });
    return response;
  };

  /**
    @description: Delete a single user
    @params: id
    @role:  -
  */

  DeleteUser = async (id: string): Promise<User> => {
    const response: User = await prisma.user.delete({
      where: { id },
    });
    return response;
  };

  /**
    @description: updates existing user information
    @params: UserUpdateInput [Prisma] 
    @role: -
  */
  UpdateUser = async (
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<User> => {
    const response: User = await prisma.user.update({
      where: { id },
      data: data || {},
    });
    return response;
  };

  /**
    @description: returns a user registered with a given email
    @params: email as string
    @role: -
  */
  GetUserByEmail = async (email: string): Promise<User | null> => {
    const user: User | null = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  };
  /**
    @description: returns a user registered with a given id
    @params: id as number
    @role: -
  */
  GetUserById = async (id: string): Promise<User | null> => {
    const user: User | null = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  };
}
export default new UsersRepo();
