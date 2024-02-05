import { TUser } from '../types/users';

class UsersRepo {
  users: TUser[];

  constructor() {
    this.users = [];
  }

  /*
    @desc : Returns all applicants in the database
    @params: no-param
    @role : system admin
  */
  GetAllUsers = async () => {
    return await this.users;
  };

  /*
    @desc: create new eucation record
    @params: ApplicantCreateInput [Prisma] 
    @role: -
  */
  CreateNewUsers = async (user: TUser) => {
    console.log('New user added to the list');
    this.users.push(user);
    return user;
  };
}

export const getYearDiff = (date1: Date, date2: Date) => {
  return Math.abs(date2.getFullYear() - date1.getFullYear());
};

export default new UsersRepo();
