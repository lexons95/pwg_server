import GraphQLJSONObject from 'graphql-type-json';

import userResolver from './user';
// import productResolver from './product';

const defaultResolver = {
    JSONObject: GraphQLJSONObject
}
export default [
    defaultResolver,
    userResolver,
    //productResolver
];