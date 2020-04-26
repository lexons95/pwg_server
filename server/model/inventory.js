import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const inventorySchema = new Schema({
  createdAt: Date,
  updatedAt: Date,
  sku: String,
  price: Number,
  stock: Number,
  variants: Object,
  description: String,
  published: Boolean,
  productId: String
},{timestamps: true});

inventorySchema.static('getInventory', function(filterObj = null) {
  let filterResult = {};
  let sorterResult = {};
  let skipResult = 0;
  let limitResult = 0;

  if (!Object.entries(filterObj).length === 0 || filterObj.constructor === Object && filterObj != null) {
      let obj = filterObj.filter ? filterObj.filter : {};
      filterResult = obj.filter ? obj.filter : {};
      let sorter = obj.sorter ? obj.sorter : {};
      sorterResult = Object.assign({},sorter);

      skipResult = obj.skip ? obj.skip : 0;
      limitResult = obj.limit ? obj.limit : 0;

      const orderBy = {
          "desc": -1,
          "acs": 1
      }
      let sorterKeys = Object.keys(sorter);
      sorterKeys.map(aKey=>{
          sorterResult[aKey] = orderBy[aKey];
      })
  }
  return this.find(filterResult).sort(sorterResult).skip(skipResult).limit(limitResult);
});

inventorySchema.static('bulkUpdate', async function(obj = {}) {
  let response = {
      success: false,
      message: "",
      data: {}
  }
  let bulkUpdateArray = [];
  if (!Object.entries(obj).length === 0 || obj.constructor === Object) {
    if (obj.inventory.length > 0) {
      let ObjectId = mongoose.Types.ObjectId;
      obj.inventory.map((anInventory)=>{
        const { _id: inventoryId, deleted=false, ...restProperty } = anInventory;
        if (deleted) {
          bulkUpdateArray.push({
            deleteOne: {
              filter: { _id: inventoryId }
            }
          })
        }
        else {
          if (inventoryId) {
            bulkUpdateArray.push({
              updateOne: {
                filter: { _id: inventoryId },
                update: {...restProperty },
                upsert: true
              }
            })
          }
          else {
            bulkUpdateArray.push({
              insertOne: {
                document: restProperty
              }
            })
          }
        }
      })
    }
  }
  console.log('bulkUpdateArray',bulkUpdateArray)
  await this.bulkWrite(bulkUpdateArray).then(res => {
    response = {
      success: true,
      message: "",
      data: res
    }
  });
  return response;
})

inventorySchema.static('updatePublishMany', async function(obj = {}) {
  let response = {
    success: false,
    message: "",
    data: {}
  } 

  if (!Object.entries(obj).length === 0 || obj.constructor === Object) {
    let ids = obj.ids ? obj.ids : [];
    let published = obj.published;
    await this.updateMany(
      {
        _id: { $in: ids }
      },
      { published: published }
    ).then(res => {
      response = {
        success: true,
        message: "",
        data: res
      }
    })

  }
  return response;
})

const Inventory = mongoose.model('Inventory', inventorySchema); 

export default {
  model: Inventory,
  schema: inventorySchema,
  Inventory: Inventory
};

/*
email: String,
    name: String,
    address: String,
    ic: String
*/