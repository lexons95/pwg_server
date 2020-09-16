import { AuthenticationError, ApolloError } from 'apollo-server-express';
import { editorOnly } from '../utils/authentication';

const resolvers = {
  Query: {
    userConfig: async (_, args={}, context) => {
      let configId = args.configId;
      const db_base = await global.connection.useDb("base"); 
      const collection_config = await db_base.collection("config");
      let response = {
        success: false,
        message: "user config id not found",
        data: {}
      }
      let foundResult = await collection_config.findOne({configId: configId})
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
  },
  Mutation: {
    updateConfig: editorOnly( async (_, args={}, { req }) => {
      let configId = args.configId;
      if (configId) {
        const db_base = await global.connection.useDb("base"); 
        const collection_config = await db_base.collection("config");
        let filter = {configId: configId};
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
