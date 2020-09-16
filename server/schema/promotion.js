import { gql } from 'apollo-server-express';

const schema = gql`
  extend type Query {
    promotions(filter: JSONObject, configId: String): [Promotion]!
    promotion(_id: String!, configId: String): Product
  }
  extend type Mutation {
    createPromotion(promotion: JSONObject!): Response!
    deletePromotion(_id: String!): Response!
    updatePublishPromotion(_id: String!, published: Boolean!): Response!
  }

  type Promotion {
    _id: String
    createdAt: Date
    updatedAt: Date
    name: String!
    description: String
    published: Boolean!
    startDate: Date!
    endDate: Date!
    type: String!
    code: String
    quantity: Int
    categories: [String!]
    products: [String!]
    minPurchases: Float
    minQuantity: Int
    rewardType: String!
    discountValue: String
    redeemed: Int!
  }

`;
export default schema;