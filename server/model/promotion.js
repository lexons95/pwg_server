import mongoose from 'mongoose';

const { Schema } = mongoose;

const promotionSchema = new Schema({
  name: String,
  description: String,
  published: {
    type: Boolean,
    default: false
  },
  startDate: Date,
  endDate: Date,
  type: {
    type: String,
    default: 'passive'
  },
  code: {
    type: String,
    default: null
  },
  quantity: {
    type: Number,
    default: null
  },
  categories: {
    type: Array,
    default: []
  },
  products: {
    type: Array,
    default: []
  },
  minPurchases: {
    type: Number,
    default: null
  },
  minQuantity: {
    type: Number,
    default: null
  },
  minWeight: {
    type: Number,
    default: null
  },
  rewardType: String,
  discountValue: {
    type: Number,
    default: null
  },
  redeemed: {
    type: Number,
    default: 0
  },
},{timestamps: true});

promotionSchema.static('getPromotions', function(filterObj = {}) {
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

promotionSchema.static('findOneOrCreate', async function(obj = null) {
  let newPromotion = obj;
    let response = {
        success: false,
        message: "",
        data: {}
    }

    if (newPromotion && newPromotion.name) {
      let findConditions = [{name: newPromotion.name}]
      if (newPromotion.type == 'active') {
        findConditions.push({code: newPromotion.code})
      }
      let findPromise = this.findOne({$or: findConditions});
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
                      success: false,
                      message: "duplicate data found, cannot create",
                      data: null
                  }
              }
              else {
                  let createPromise = this.create(newPromotion);
                  await createPromise.then((result, error) => {
                      if (error) {
                          response = {
                              success: false,
                              message: "error in create",
                              data: error
                          }
                      }
                      else {
                          response = {
                              success: true,
                              message: "data created",
                              data: result
                          }
                      }
                  });
              }
          }
      })   
    }
    else {
        response = {
            success: false,
            message: "data required not complete",
            data: {}
        }
    }
    
    return response;
});

const Promotion = mongoose.model('Promotion', promotionSchema); 

export default {
  model: Promotion,
  schema: promotionSchema,
  Product: Promotion
};