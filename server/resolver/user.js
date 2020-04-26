import mongoose from 'mongoose';
import { AuthenticationError } from 'apollo-server-express';
import UserModel from '../model/user';
import { createPassword } from '../utils/password';
import { createToken, tokenCookies } from "../utils/token";

const authenticate = role => resolver => {
  return (parent, args, context, info) => {
    if (context.user && (!role || context.user.role === role)) {
      return resolver(parent, args, context, info)
    } else {
      throw new AuthenticationError('Unauthorized')
    }
  }
}

const adminsOnly = authenticate('ADMIN')

const resolvers = {
    Query: {
      users: adminsOnly( async (_, args={}, context) => {
        const db_base = await global.connection.useDb("base");
        const collection_user = await db_base.model("User",UserModel.schema,'user');

        return await collection_user.getUsers(args);
      }),
      user: async (_, args={}, context) => {
        const db_base = await global.connection.useDb("base");
        const collection_user = await db_base.model("User",UserModel.schema,'user');

        return await collection_user.findOne(args);
      },
      loggedInUser: async (_, args={}, context) => {
        // if (!context.req.user) throw new AuthenticationError("Must authenticate");
        if (context.req.user) {
          const db_base = await global.connection.useDb("base");
          const collection_user = await db_base.model("User",UserModel.schema,'user');
          return await collection_user.findOneUser({username: context.req.user.username});
        }
        else {
          return {
            success: false,
            message: "no user logged in",
            data: null
          }
        }
      }
    },
    Mutation: {
      createUser: async (_, args={}, context) => {
        const db_base = await global.connection.useDb("base");
        const collection_user = await db_base.model("User",UserModel.schema,'user');

        let hashPassword = createPassword(args.user.password);
        const newUserObj = Object.assign({},args.user,{password: hashPassword, config_id: "", tokenCount: 0, role: "CUSTOMER"});
        
        let createResult = await collection_user.findOneOrCreate(newUserObj);
        return createResult;
        // if (createResult.success) {
        //     let tokenData = {
        //         _id: signUpResult.data._id, 
        //         username: signUpResult.data.username, 
        //         role: signUpResult.data.role, 
        //         tokenCount: signUpResult.data.tokenCount
        //     }
        //     let newAccessToken = await createToken(tokenData);
        //     return Object.assign({},signUpResult, { accessToken: newAccessToken })
        // }
        // else {
        //     return signUpResult;
        // }
      },
      // loginUser: async (_, args={}, context) => {
      //   console.log("loginUser",args)
      //   const { user, info } = await context.authenticate("graphql-local", {
      //     username: args.user.username,
      //     password: args.user.password
      //   });
      //   console.log("loginUser2",user)
      //         // only required if express-session is used
      //   context.login(user);
  
      //   return {
      //     success: true,
      //     message: "logged in",
      //     data: user
      //   };
      // },
      login: async (_, args={}, context) => {
        const db_base = await global.connection.useDb("base");
        const collection_user = await db_base.model("User",UserModel.schema,'user');

        let username = { username: args.user.username }
        let userFoundResult = await collection_user.findOneUser(username);
        if (userFoundResult.success) {
            const isValidPassword = await userFoundResult.data.validatePassword(args.user.password);
            if (isValidPassword) {
                // let tokenData = {
                //     _id: userFoundResult.data._id, 
                //     username: userFoundResult.data.username, 
                //     role: userFoundResult.data.role, 
                //     tokenCount: userFoundResult.data.tokenCount
                // }
                let tokenData = userFoundResult.data;
                let newAccessToken = await createToken(tokenData);
                const cookies = tokenCookies(newAccessToken);

                context.res.cookie(...cookies.access);
                context.res.cookie(...cookies.refresh);
                return userFoundResult;
            }
            else {
                return {
                    success: false,
                    message: "Failed to validate password",
                    data: null
                }
            }
        }
        return userFoundResult;
      },
      logout: async (_, args={}, context) => {
        
        context.res.clearCookie("access-saas");
        context.res.clearCookie("refresh-saas");
        
        return await {
          success: true,
          message: "Logout Success",
          data: null
        }
      }

        
    }
    
};

export default resolvers;
