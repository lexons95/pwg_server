import { gql } from 'apollo-server-express';

import productSchema from './product';
import userSchema from './user';
import inventorySchema from './inventory';
import orderSchema from './order';
import promotionSchema from './promotion';
import constantsSchema from './constants';
import configSchema from './config';

const linkSchema = gql`
    scalar JSON
    scalar JSONObject
    scalar Date
    
    type Query {
        _: Boolean
    }
    type Mutation {
        _: Boolean
    }
    type Subscription {
        _: Boolean
    }

    type Response {
        success: Boolean!
        message: String
        data: JSONObject
        token: JSONObject
    }

`;

export default [
    linkSchema,
    constantsSchema,
    userSchema,
    productSchema,
    inventorySchema,
    orderSchema,
    configSchema,
    promotionSchema
];