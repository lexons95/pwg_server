import { AuthenticationError } from 'apollo-server-express';
import OrderModel from '../model/order';
import InventoryModel from '../model/inventory';
import ProductModel from '../model/product';

import { editorOnly } from '../utils/authentication';


const resolvers = {
  Query: {
    orders: async (_, args=null, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser && loggedInUser.configId ? loggedInUser.configId : args.configId;
      const db_base = await global.connection.useDb(dbName);
      const collection_order = await db_base.model("Order",OrderModel.schema,'order');

      return await collection_order.getOrders(args);
    },
    order: async (_, args=null, context) => {
      return "read order"
    }


      
  },
  Mutation: {
    createOrder: async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = args.configId;
      if (dbName) {
        if (args.order && args.order.items && args.order.items.length > 0) {
          let orderItems = args.order.items;
          const db_base = await global.connection.useDb(dbName);
          const collection_product = await db_base.model("Product",ProductModel.schema,'product');
          const collection_inventory = await db_base.model("Inventory",InventoryModel.schema,'inventory');
          const collection_order = await db_base.model("Order",OrderModel.schema,'order');

          
          let checkProductPublishedResult = await collection_product.checkProductPublish(orderItems);

          if (checkProductPublishedResult && checkProductPublishedResult.success) {
            let checkStockResult = await collection_inventory.checkInventoryStock(orderItems);
            if (checkStockResult && checkStockResult.success) {
              const newOrderObj = Object.assign({},args.order);
              let createResult = await collection_order.createOrder(newOrderObj);
              console.log('createResult',createResult)
              if (createResult && createResult.success) {
                let bulkUpdateResult = await collection_inventory.bulkModifyInventory(createResult.data, 'decrease');
                return {...bulkUpdateResult, data: createResult.data};
              }
              return createResult;
            }
            return checkStockResult;
          }
          return checkProductPublishedResult;
        }
        return {
          success: false,
          message: "not item in order",
          data: {}
        };
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };

    },
    updateOrderPayment: editorOnly( async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser && loggedInUser.configId ? loggedInUser.configId : args.configId;
      if (dbName) {
        const db_base = await global.connection.useDb(dbName);
        const collection_order = await db_base.model("Order",OrderModel.schema,'order');
        
        let updateResult = await collection_order.updateOrderPayment(args);
        return updateResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    }),
    updateOrderDelivery: editorOnly( async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser && loggedInUser.configId ? loggedInUser.configId : args.configId;
      if (dbName) {
        const db_base = await global.connection.useDb(dbName);
        const collection_order = await db_base.model("Order",OrderModel.schema,'order');
        
        let updateResult = await collection_order.updateOrderDelivery(args);
        return updateResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    }),
    updateOrderStatus: editorOnly( async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser && loggedInUser.configId ? loggedInUser.configId : args.configId;
      if (dbName) {
        const db_base = await global.connection.useDb(dbName);
        const collection_order = await db_base.model("Order",OrderModel.schema,'order');
        
        let updateResult = await collection_order.updateOrderStatus(args);
        return updateResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    }),
    cancelOrder: editorOnly( async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser && loggedInUser.configId ? loggedInUser.configId : args.configId;
      if (dbName) {
        const db_base = await global.connection.useDb(dbName);
        const collection_order = await db_base.model("Order",OrderModel.schema,'order');
        
        let cancelResult = await collection_order.cancelOrder(args);
        if (cancelResult && cancelResult.success) {
          const collection_inventory = await db_base.model("Inventory",InventoryModel.schema,'inventory');
          let bulkUpdateResult = await collection_inventory.bulkModifyInventory(cancelResult.data);
          return bulkUpdateResult;
        }
        return cancelResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    }),
      
  }
  
};

export default resolvers;
