import { AuthenticationError } from 'apollo-server-express';
import OrderModel from '../model/order';
import InventoryModel from '../model/inventory';

import { editorOnly } from '../utils/authentication';


const resolvers = {
  Query: {
    orders: editorOnly( async (_, args=null, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser && loggedInUser.configId ? loggedInUser.configId : args.configId;
      const db_base = await global.connection.useDb(dbName);
      const collection_order = await db_base.model("Order",OrderModel.schema,'order');

      return await collection_order.getOrders(args);
    }),
    order: async (_, args=null, context) => {
      return "read user"
    }


      
  },
  Mutation: {
    createOrder: async (_, args={}, context) => {
      let loggedInUser = context.req.user;
      let dbName = loggedInUser && loggedInUser.configId ? loggedInUser.configId : args.configId;
      if (dbName) {
        const db_base = await global.connection.useDb(dbName);
        const collection_order = await db_base.model("Order",OrderModel.schema,'order');
        const newOrderObj = Object.assign({},args.order);
        
        let createResult = await collection_order.createOrder(newOrderObj);
        console.log('createResult',createResult)
        // if (createResult && createResult.success) {
        //   const collection_inventory = await db_base.model("Inventory",InventoryModel.schema,'inventory');
        //   let bulkUpdateResult = await collection_inventory.bulkModifyInventory(createResult.data, 'decrease');
        //   return bulkUpdateResult;
        // }
        return createResult;
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
