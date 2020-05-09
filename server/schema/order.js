import { gql } from 'apollo-server-express';

const schema = gql`
  extend type Query {
    orders(filter: JSONObject, configId: String): [Order]!
    order(id: String!) : Order
  }
  extend type Mutation {
    createOrder(order: JSONObject!, configId: String): Response!
    updateOrder(order: JSONObject!): Response!
    deleteOrder(id: String!): Response!

    updateOrderPayment(_id: String!, paid: Boolean!): Response!
    updateOrderDelivery(_id: String!, trackingNum: String): Response!
    cancelOrder(_id: String!): Response!
  }

  type Order {
    _id: String
    createdAt: Date
    updatedAt: Date

    items: [JSONObject]
    deliveryFee: Float
    total: Float!
    customer: JSONObject

    paid: Boolean!
    sentOut: Boolean!
    trackingNum: String
    status: String

  }
`;

export default schema;