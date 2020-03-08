import mongoose from 'mongoose';
import UserModel from '../model/user';

const resolvers = {
    Query: {
      users: async (_, args={}, {connection, ...req}) => {
        const database = await connection.useDb("base");
        const xxx = await database.model("User",UserModel.schema,'user');
        // console.log('Usersss',xxx);
        return xxx.readUsers(args);
        // return "read users"
      },
      user: async (_, args={}, req) => {
        return "read user"
      }


        
    },
    Mutation: {
       
        
    }
    
};

export default resolvers;
