import { AuthenticationError } from 'apollo-server-express';
import ProductModel from '../model/product';
import { editorOnly } from '../utils/authentication';

const resolvers = {
  Query: {
    products: async (_, args=null, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser && loggedInUser.configId ? loggedInUser.configId : args.configId;
      const db_base = await global.connection.useDb(dbName);
      const collection_product = await db_base.model("Product",ProductModel.schema,'product');

      return await collection_product.getProducts(args);
    },
    product: async (_, args=null, context) => {
      return "read user"
    }


      
  },
  Mutation: {
    createProduct: editorOnly( async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser.configId;
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
    }),
    createProducts: editorOnly( async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser.configId;
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
    }),
    updateProduct: editorOnly( async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser.configId;
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
    }),
    deleteProduct: editorOnly( async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser.configId;
      if (dbName || args._id) {
        const db_base = await global.connection.useDb(dbName);
        const collection_product = await db_base.model("Product",ProductModel.schema,'product');
        let deleteResult = await collection_product.deleteOneProduct(args._id);
        return deleteResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    }),
    updateProductPublish: editorOnly( async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser.configId;
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
    })
      
  }
  
};

export default resolvers;
