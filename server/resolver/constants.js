import { AuthenticationError, ApolloError } from 'apollo-server-express';
import qiniuAPI from '../utils/qiniuAPI';
import { editorOnly } from '../utils/authentication';

const resolvers = {
  Query: {
    userConfig: async (_, args={}, context) => {
      let dbName = args.configId;
      const db_base = await global.connection.useDb("base"); 
      const collection_config = await db_base.collection("config");
      let response = {
        success: false,
        message: "user config id not found",
        data: {}
      }
      let foundResult = await collection_config.findOne({configId: dbName})
      if (foundResult) {
        return {
          success: true,
          message: "config found",
          data: foundResult
        }
      }
      else {
        return new ApolloError("Config not found");
      }
    },
    qiniuToken: editorOnly( (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser && loggedInUser.configId ? loggedInUser.configId : args.configId;
      let getTokenResult = qiniuAPI(dbName).getToken();
      if (getTokenResult.success) {
        return getTokenResult;
      }
      else {
        return new ApolloError("Failed to get token");
      }
    })
  },
  Mutation: {
    qiniuBatchDelete: editorOnly( async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser && loggedInUser.configId ? loggedInUser.configId : args.configId;
      let batchDeleteResult = await qiniuAPI(dbName).batchDelete(args.images).then(result=>{
        return result
      }).catch(err=>{
        console.log('batchDeleteResult err',err)
      });
      if (batchDeleteResult) {
        return batchDeleteResult;
      }
      else {
        return new ApolloError("Failed to delete");
      } 
    }),
    updateConfig: editorOnly( async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser && loggedInUser.configId ? loggedInUser.configId : args.configId;
      if (dbName) {
        const db_base = await global.connection.useDb("base"); 
        const collection_config = await db_base.collection("config");
        let filter = {configId: dbName};
        let setter = {
          $set: args.config
        }
        let foundResult = await collection_config.findOneAndUpdate(filter, setter, {
          returnOriginal: false
        })
        if (foundResult) {
          return {
            success: true,
            message: "config found",
            data: foundResult
          }
        }
      }
      return new ApolloError("Config not found");
      
    }),
  }
};

export default resolvers;
