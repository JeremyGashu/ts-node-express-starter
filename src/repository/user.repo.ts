import PClient, { Prisma } from '@prisma/client'

const prisma = new PClient.PrismaClient()

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
    const response = await prisma.user.create({data : user});
    return response;
  };
}


export default new UsersRepo();
