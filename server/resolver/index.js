import GraphQLJSONObject from 'graphql-type-json';

import userResolver from './user';
import productResolver from './product';
import inventoryResolver from './inventory';
import orderResolver from './order';
import promotionResolver from './promotion';
import configResolver from './config';
import constantsResolver from './constants';


const defaultResolver = {
    JSONObject: GraphQLJSONObject
}
export default [
    defaultResolver,
    constantsResolver,
    userResolver,
    productResolver,
    inventoryResolver,
    orderResolver,
    configResolver,
    promotionResolver
];