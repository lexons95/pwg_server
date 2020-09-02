import { gql } from 'apollo-server-express';

const schema = gql`
  extend type Query {
    promotions(filter: JSONObject, configId: String): [Product]!
    promotion(_id: String!, configId: String): Product
  }
  extend type Mutation {
    createPromotion(promotion: JSONObject!): Response!
  }

  type Promotion {
    _id: String
    createdAt: Date
    updatedAt: Date
    name: String!
    subName: String
    description: String
    category: [JSONObject]
    variants: JSONObject
    tags: [String]
    type: String!
    published: Boolean!
    images: [JSONObject]!    
  }

`;
export default schema;