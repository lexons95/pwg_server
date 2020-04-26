import mongoose from 'mongoose';
import { AuthenticationError } from 'apollo-server-express';
import ProductModel from '../model/product';
import qiniuAPI from '../utils/qiniuAPI';

const resolvers = {
  Query: {
    products: async (_, args=null, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser.config_id;
      const db_base = await global.connection.useDb(dbName);
      const collection_product = await db_base.model("Product",ProductModel.schema,'product');

      return await collection_product.getProducts(args);
    },
    product: async (_, args=null, context) => {
      return "read user"
    }


      
  },
  Mutation: {
    createProduct: async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser.config_id;
      if (dbName) {
        const db_base = await global.connection.useDb(dbName);
        const collection_product = await db_base.model("Product",ProductModel.schema,'product');
        const newProductObj = Object.assign({},args.product,{published: false, images: []});
        
        let createResult = await collection_product.findOneOrCreate(newProductObj);
        return createResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    },
    updateProduct: async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser.config_id;
      if (dbName) {
        const db_base = await global.connection.useDb(dbName);
        const collection_product = await db_base.model("Product",ProductModel.schema,'product');
        const productObj = args.product;

        let updateResult = await collection_product.updateOne(productObj);
        return updateResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    },
    deleteProduct: async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser.config_id;
      if (dbName || args._id) {
        const db_base = await global.connection.useDb(dbName);
        const collection_product = await db_base.model("Product",ProductModel.schema,'product');
        let deleteResult = await collection_product.deleteOneProduct(args._id);
        console.log('deleteResult',deleteResult)
        return deleteResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    },
    updateProductPublish: async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser.config_id;
      if (dbName) {
        const db_base = await global.connection.useDb(dbName);
        const collection_product = await db_base.model("Product",ProductModel.schema,'product');
        
        let updateResult = await collection_product.updatePublishMany(args);
        return updateResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    },
    testUploadImage: async (_, args={}, context) => {
      
        const x = qiniuAPI();
        console.log('QiniuAPI',x)
        return "testUploadImage"
    }
      
  }
  
};

export default resolvers;
