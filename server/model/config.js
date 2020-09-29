import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const configSchema = new Schema({
  configId: String,
  server: String,
  imageSrc: String,
  bucketName: String,
  defaultImage_system: String,
  defaultImage: String,
  paymentQRImage: String,
  currencyUnit: String,
  profile: Object,
  delivery: Number,
  productImageLimit: Number,
  inventoryPerProductLimit: Number,
  productTypes: Array,
  charges: Array,
  pages: Array
},{timestamps: true});

configSchema.static('getConfigs', function(obj = {}) {
  let filterResult = {};
  let sorterResult = {};
  let skipResult = 0;
  let limitResult = 0;

  if (!Object.entries(obj).length === 0 || obj.constructor === Object) {
      
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

configSchema.statics.updateConfig = async function(user) {

    let response = {
        success: false,
        message: "",
        data: {}
    }

    let filter = {
        username: user.username
    }
    let updatePromise = this.findOneAndUpdate(
        filter,
        user, 
        {
            new: true
        }
    )   
    await updatePromise.then((result, error) => {
        if (error) {
            response = {
                success: false,
                message: "error in update",
                data: error
            }
        }
        else {
            response = {
                success: true,
                message: "data updated",
                data: result
            }
        }
    });

    return response;
}

configSchema.statics.findOneConfig = async function(obj) {
    let response = {
        success: false,
        message: "",
        data: {}
    }
    let findPromise = this.findOne(obj);
    await findPromise.then( async (result, error) => {
        if (error) {
            response = {
                success: false,
                message: "error in find",
                data: error
            }
        }
        else {
            if (result) {
                response = {
                    success: true,
                    message: "data found",
                    data: result
                }
            }
            else {
                response = {
                    success: false,
                    message: "user not found",
                    data: null
                }
            }
        }
    })

    return response;
}


const Config = mongoose.model('Config', configSchema); 

export default {
  model: Config,
  schema: configSchema,
  Config: Config
};

/*
email: String,
    name: String,
    address: String,
    ic: String
*/