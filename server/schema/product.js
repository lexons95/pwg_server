import { gql } from 'apollo-server-express';

const schema = gql`
  extend type Query {
    products(filter: JSONObject): [Product]!
    product(id: String!): Product
  }
  extend type Mutation {
    createProduct(product: JSONObject!): Response!
    createProducts(products: [JSONObject!]!): Response!
    updateProduct(product: JSONObject!): Response!
    deleteProduct(id: String!): Response!
  }

  type Product {
    _id: String
    dateCreated: Date
    dateUpdated: Date
    name: String!
    description: String
    variant: JSONObject
    published: Boolean!
    images: [Image]!    
  }

  type Image {
    src: String!
    name: String
    description: String
    fav: Boolean
  }

}
`;

export default schema;