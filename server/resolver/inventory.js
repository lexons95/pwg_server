import mongoose from 'mongoose';
import { AuthenticationError } from 'apollo-server-express';
import InventoryModel from '../model/inventory';

const resolvers = {
  Query: {
    inventory: async (_, args=null, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser.config_id;
      const db_base = await global.connection.useDb(dbName);
      const collection_inventory = await db_base.model("Inventory",InventoryModel.schema,'inventory');

      return await collection_inventory.getInventory(args);
    },
      
  },
  Mutation: {
    bulkUpdateInventory: async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser.config_id;
      if (dbName) {
        const db_base = await global.connection.useDb(dbName);
        const collection_inventory = await db_base.model("Inventory",InventoryModel.schema,'inventory');
        
        let updateResult = await collection_inventory.bulkUpdate(args);
        return updateResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    },
    updateInventoryPublish: async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser.config_id;
      if (dbName) {
        const db_base = await global.connection.useDb(dbName);
        const collection_inventory = await db_base.model("Inventory",InventoryModel.schema,'inventory');
        
        let updateResult = await collection_inventory.updatePublishMany(args);
        return updateResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    }
    // createProduct: async (_, args={}, context) => {
    //   let loggedInUser = context.req.user;
    //   let dbName = loggedInUser.config_id;
    //   if (dbName) {
    //     const db_base = await global.connection.useDb(dbName);
    //     const collection_product = await db_base.model("Product",ProductModel.schema,'product');
    //     const newProductObj = Object.assign({},args.product,{published: false, images: []});
        
    //     let createResult = await collection_product.findOneOrCreate(newProductObj);
    //     return createResult;
    //   }
    //   return {
    //     success: false,
    //     message: "user config id not found",
    //     data: {}
    //   };
    // },
    // updateProduct: async (_, args={}, context) => {
    //   let loggedInUser = context.req.user;
    //   let dbName = loggedInUser.config_id;
    //   if (dbName) {
    //     const db_base = await global.connection.useDb(dbName);
    //     const collection_product = await db_base.model("Product",ProductModel.schema,'product');
    //     const productObj = args.product;

    //     let updateResult = await collection_product.updateOne(productObj);
    //     return updateResult;
    //   }
    //   return {
    //     success: false,
    //     message: "user config id not found",
    //     data: {}
    //   };
    // },
    // deleteProduct: async (_, args={}, context) => {
    //   let loggedInUser = context.req.user;
    //   let dbName = loggedInUser.config_id;
    //   if (dbName || args._id) {
    //     const db_base = await global.connection.useDb(dbName);
    //     const collection_product = await db_base.model("Product",ProductModel.schema,'product');
    //     let deleteResult = await collection_product.deleteOneProduct(args._id);
    //     console.log('deleteResult',deleteResult)
    //     return deleteResult;
    //   }
    //   return {
    //     success: false,
    //     message: "user config id not found",
    //     data: {}
    //   };
    // }
      
  }
  
};

export default resolvers;
