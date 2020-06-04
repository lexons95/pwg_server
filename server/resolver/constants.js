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
    qiniuToken: editorOnly( async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser && loggedInUser.configId ? loggedInUser.configId : null;
      const db_base = await global.connection.useDb("base"); 
      const collection_config = await db_base.collection("config");
      if (dbName) {
        let foundConfigResult = await collection_config.findOne({configId: dbName});
        if (foundConfigResult) {
          let bucketName = foundConfigResult.bucketName;
          let getTokenResult = qiniuAPI(bucketName).getToken();
          if (getTokenResult.success) {
            return getTokenResult;
          }
          else {
            return new ApolloError("Failed to get token");
          }
        }
        else {
          return new ApolloError("Failed to get config");
        }
      }
      else {
        return new ApolloError("Failed to get token");
      }
    })
  },
  Mutation: {
    qiniuBatchDelete: editorOnly( async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser && loggedInUser.configId ? loggedInUser.configId : null;
      const db_base = await global.connection.useDb("base"); 
      const collection_config = await db_base.collection("config");
      if (dbName) {
        let foundConfigResult = await collection_config.findOne({configId: dbName});
        if (foundConfigResult) {
          let bucketName = foundConfigResult.bucketName;
          let batchDeleteResult = await qiniuAPI(bucketName).batchDelete(args.images).then(result=>{
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
        }
        else {
          return new ApolloError("Failed to get config");
        }
      }
      else {
        return new ApolloError("Failed to get token");
      }
    }),
    qiniuBatchCopy: editorOnly( async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser && loggedInUser.configId ? loggedInUser.configId : null;
      // let newBucketName = args.targetBucketName;
      let newBucketName = "mananml-2";
      const db_base = await global.connection.useDb("base"); 
      const collection_config = await db_base.collection("config");
      if (dbName) {
        let foundConfigResult = await collection_config.findOne({configId: dbName});
        if (foundConfigResult) {
          let bucketName = foundConfigResult.bucketName;
          let batchCopyResult = await qiniuAPI(bucketName).batchCopy(args.images, newBucketName).then(result=>{
            return result
          }).catch(err=>{
            console.log('batchCopyResult err',err)
          });
          if (batchCopyResult) {
            return batchCopyResult;
          }
          else {
            return new ApolloError("Failed to delete");
          } 
        }
        else {
          return new ApolloError("Failed to get config");
        }
      }
      else {
        return new ApolloError("Failed to get token");
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
