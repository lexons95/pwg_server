import { gql } from 'apollo-server-express';

const schema = gql`
  extend type Query {
    inventory(productId: String!): [Inventory]!
  }
  extend type Mutation {
    createInventory(inventory: JSONObject!): Response!
    updateInventory(inventory: JSONObject!): Response!
    deleteInventory(id: String!): Response!
  }

  type Inventory {
    _id: String
    dateCreated: Date
    dateUpdated: Date
    sku: String!
    price: Float!
    variant: [JSONObject]
    description: String
    published: Boolean!
    productId: String
  }
`;

export default schema;