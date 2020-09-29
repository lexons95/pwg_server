import { AuthenticationError, ApolloError } from 'apollo-server-express';

import PromotionModel from '../model/promotion';

import { editorOnly } from '../utils/authentication';

const resolvers = {
  Query: {
    promotions: async (_, args=null, { req }) => {
      let configId = args.configId;
      const db_base = await global.connection.useDb(configId);
      const collection_promotion = await db_base.model("Promotion",PromotionModel.schema,'promotion');

      return await collection_promotion.getPromotions(args);
    },
  },
  Mutation: {
    createPromotion: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser.configId;
      if (configId) {
        const db_base = await global.connection.useDb(configId);
        const collection_promotion = await db_base.model("Promotion",PromotionModel.schema,'promotion');
        const newPromotionObj = Object.assign({},args.promotion);
        
        let createResult = await collection_promotion.findOneOrCreate(newPromotionObj);
        return createResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    }),
    deletePromotion: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser.configId;
      if (configId) {
        const db_base = await global.connection.useDb(configId);
        const collection_promotion = await db_base.model("Promotion",PromotionModel.schema,'promotion');
        
        let deleteResult = await collection_promotion.findByIdAndDelete(args._id).catch(error=>{
          return new ApolloError("Error on deleting"); 
        })
        if (deleteResult) {
          return {
            success: true,
            message: "promotion deleted",
            data: deleteResult
          };
        }
        return {
          success: false,
          message: "error on deleting",
          data: null
        }
      }
      return {
        success: false,
        message: "user config id not found",
        data: null
      };
    }),
    updatePublishPromotion: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser.configId;
      if (configId) {
        const db_base = await global.connection.useDb(configId);
        const collection_promotion = await db_base.model("Promotion",PromotionModel.schema,'promotion');        
        const updatePublishResult = await collection_promotion.findByIdAndUpdate(args._id, { published: args.published }, {new: true}).catch(error=>{
          return new ApolloError("Error on updating"); 
        })
        if (updatePublishResult) {
          return {
            success: true,
            message: "published updated",
            data: updatePublishResult
          };
        }
        return {
          success: false,
          message: "error on updating",
          data: null
        }
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    }),
  }
}

export default resolvers;
