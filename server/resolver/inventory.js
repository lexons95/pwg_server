import { AuthenticationError } from 'apollo-server-express';
import InventoryModel from '../model/inventory';
import { editorOnly } from '../utils/authentication';

const resolvers = {
  Query: {
    inventory: async (_, args=null, { req }) => {
      let loggedInUser = req.user;
      let configId = args.configId;
      if (configId) {
        const db_base = await global.connection.useDb(configId);
        const collection_inventory = await db_base.model("Inventory",InventoryModel.schema,'inventory');
        return await collection_inventory.getInventory(args);
      }
      return [];
    },
      
  },
  Mutation: {
    bulkUpdateInventory: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser && loggedInUser.configId ? loggedInUser.configId : null;
      if (configId) {
        const db_base = await global.connection.useDb(configId);
        const collection_inventory = await db_base.model("Inventory",InventoryModel.schema,'inventory');
        
        let updateResult = await collection_inventory.bulkUpdate(args);
        return updateResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    }),
    updateInventoryPublish: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser && loggedInUser.configId ? loggedInUser.configId : null;

      if (configId) {
        const db_base = await global.connection.useDb(configId);
        const collection_inventory = await db_base.model("Inventory",InventoryModel.schema,'inventory');
        
        let updateResult = await collection_inventory.updatePublishMany(args);
        return updateResult;
      }
      return {
        success: false,
        message: "user config id not found",
        data: {}
      };
    }),
    deleteInventory: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser && loggedInUser.configId ? loggedInUser.configId : null;

      if (configId) {
        // const db_base = await global.connection.useDb(configId);
        // const collection_inventory = await db_base.model("Inventory",InventoryModel.schema,'inventory');
        
        // let updateResult = await collection_inventory.bulkUpdate(args);
        // return updateResult;
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
