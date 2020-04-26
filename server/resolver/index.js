import GraphQLJSONObject from 'graphql-type-json';

import userResolver from './user';
import productResolver from './product';
import inventoryResolver from './inventory';

const defaultResolver = {
    JSONObject: GraphQLJSONObject
}
export default [
    defaultResolver,
    userResolver,
    productResolver,
    inventoryResolver
];