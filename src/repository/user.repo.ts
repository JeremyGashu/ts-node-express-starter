import PClient, { Prisma, User } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PClient.PrismaClient();

class UsersRepo {
  /*
    @desc : Returns all users in the database
    @params: no-param
    @role : system admin
  */
  GetAllUsers = async (): Promise<User[]> => {
    return await prisma.user.findMany();
  };

  /*
    @desc: create new eucation record
    @params: Prisma.UserCreateInput
    @role: -
  */
  CreateNewUsers = async (user: Prisma.UserCreateInput): Promise<User> => {
    user.password = bcrypt.hashSync(user.password, 12);
    console.log('*****Hashed password****', user.password);
    const response: User = await prisma.user.create({ data: user });
    return response;
  };

  /*
    @desc: Delete a single user
    @params: id
    @role:  -
  */

  DeleteUser = async (id: string): Promise<User> => {
    const response: User = await prisma.user.delete({
      where: { id },
    });
    return response;
  };

  /*
    @desc: updates existing user information
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

  /*
    @desc: returns a user registered with a given email
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
  /*
    @desc: returns a user registered with a given id
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
