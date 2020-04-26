import { gql } from 'apollo-server-express';

const schema = gql`
  extend type Query {
    products(filter: JSONObject): [Product]!
    product(_id: String!): Product
  }
  extend type Mutation {
    createProduct(product: JSONObject!): Response!
    createProducts(products: [JSONObject!]!): Response!
    updateProduct(product: JSONObject!): Response!
    deleteProduct(_id: String!): Response!
    updateProductPublish(ids: [String!], published: Boolean!): Response!
    testUploadImage: String
  }

  type Product {
    _id: String
    createdAt: Date
    updatedAt: Date
    name: String!
    description: String
    variants: JSONObject
    published: Boolean!
    images: [JSONObject]!    
  }

  type Image {
    src: String!
    name: String
    description: String
    fav: Boolean
  }
`;
export default schema;