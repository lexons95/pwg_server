import { AuthenticationError, ApolloError } from 'apollo-server-express';
import ProductModel from '../model/product';
import InventoryModel from '../model/inventory';

import { editorOnly } from '../utils/authentication';

const resolvers = {
  Query: {
    products: async (_, args=null, { req }) => {
      let configId = args.configId;
      const db_base = await global.connection.useDb(configId);
      const collection_product = await db_base.model("Product",ProductModel.schema,'product');

      return await collection_product.getProducts(args);
    },
    product: async (_, args=null, { req }) => {
      let configId = args.configId;
      if (configId) {
        const db_base = await global.connection.useDb(configId);
        const collection_product = await db_base.model("Product",ProductModel.schema,'product');
        return await collection_product.findById(args._id);
      }
      else {
        return new ApolloError("Config not found");
      }
    }
      
  },
  Mutation: {
    createProduct: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser.configId;
      if (configId) {
        const db_base = await global.connection.useDb(configId);
        const collection_product = await db_base.model("Product",ProductModel.schema,'product');
        const newProductObj = Object.assign({},args.product);
        
        let createResult = await collection_product.findOneOrCreate(newProductObj);
        return createResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    }),
    createProducts: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser.configId;
      if (configId) {
        const db_base = await global.connection.useDb(configId);
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
    }),
    updateProduct: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser.configId;
      if (configId) {
        const db_base = await global.connection.useDb(configId);
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
    }),
    updateProductAndInventory: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser.configId;
      if (configId) {
        const db_base = await global.connection.useDb(configId);
        const collection_product = await db_base.model("Product",ProductModel.schema,'product');
        const productObj = args.product;

        let updateResult = await collection_product.updateOne(productObj);
        if (updateResult && updateResult.success && args.inventory != undefined) {
          const inventoryArray = args.inventory;
          const collection_inventory = await db_base.model("Inventory",InventoryModel.schema,'inventory');
          let bulkUpdateResult = await collection_inventory.bulkUpdate({inventory: inventoryArray});
          return bulkUpdateResult;
        }
        return updateResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    }),
    deleteProduct: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser.configId;
      if (configId || args._id) {
        const db_base = await global.connection.useDb(configId);
        const collection_product = await db_base.model("Product",ProductModel.schema,'product');
        let deleteResult = await collection_product.deleteOneProduct(args._id);
        if (deleteResult && deleteResult.success) {
          const collection_inventory = await db_base.model("Inventory",InventoryModel.schema,'inventory');
          let foundInventoryResult = await collection_inventory.find({ productId: args._id}).lean();
          if (foundInventoryResult && foundInventoryResult.length > 0) {
            let deleteInventoryList = foundInventoryResult.map((anItem)=>{
              let newObj = Object.assign({},anItem,{deleted: true});
              return newObj;
            })
            
            let bulkUpdateResult = await collection_inventory.bulkUpdate({inventory: deleteInventoryList});

            return bulkUpdateResult;
          }
        }
        return deleteResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    }),
    updateProductPublish: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser.configId;
      if (configId) {
        const db_base = await global.connection.useDb(configId);
        const collection_product = await db_base.model("Product",ProductModel.schema,'product');
        
        let updateResult = await collection_product.updatePublishMany(args);
        return updateResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    })
      
  }
  
};

export default resolvers;
