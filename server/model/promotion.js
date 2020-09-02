import mongoose from 'mongoose';

const { Schema } = mongoose;

const promotionSchema = new Schema({
    name: String,
    description: String,
    tags: {
      type: Array,
      default: []
    },
    published: {
        type: Boolean,
        default: false
    },
    images: {
        type: Array,
        default: []
    }
},{timestamps: true});



const Promotion = mongoose.model('Promotion', promotionSchema); 

export default {
  model: Promotion,
  schema: promotionSchema,
  Product: Promotion
};