import PClient, { Prisma, User } from '@prisma/client';

const prisma = new PClient.PrismaClient();

class UsersRepo {
  /*
    @desc : Returns all users in the database
    @params: no-param
    @role : system admin
  */
  GetAllUsers = async () => {
    return await prisma.user.findMany();
  };

  /*
    @desc: create new eucation record
    @params: Prisma.UserCreateInput
    @role: -
  */
  CreateNewUsers = async (user: Prisma.UserCreateInput) => {
    const response: User = await prisma.user.create({ data: user });
    return response;
  };

  /*
    @desc: Delete a single user
    @params: id
    @role:  -
  */

  DeleteUser = async (id: number) => {
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
  UpdateUser = async (id: number, data: Prisma.UserUpdateInput) => {
    const response: User = await prisma.user.update({
      where: { id },
      data: data || {},
    });
    return response;
  };
}

export default new UsersRepo();
