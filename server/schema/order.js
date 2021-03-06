import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    orders(filter: JSONObject, configId: String): [Order]!
    orders2(filter: JSONObject, configId: String): JSONObject
    searchOrders(filter: String!, configId: String): [Order]!
    order(_id: String!): Order
    checkCart(
      configId: String!
      items: [JSONObject!]
      promoCode: String
    ): Response!
  }
  extend type Mutation {
    createOrder(order: JSONObject!, configId: String): Response!
    updateOrder(order: JSONObject!): Response!

    updateOrderPayment(_id: String!, paid: Boolean!): Response!
    updateOrderDelivery(_id: String!, trackingNum: String): Response!
    updateOrderStatus(_id: String!, status: String!): Response!
    cancelOrder(_id: String!): Response!
    cancelManyOrder(orderIds: [String!]): Response!
    updateOrderRemark(_id: String!, sellerRemark: String!): Response!
    updateOrderData(_id: String!, property: String!, value: String!): Response!
  }

  type Order {
    _id: String
    createdAt: Date
    updatedAt: Date

    type: String
    items: [JSONObject]
    deliveryFee: Float
    total: Float!
    subTotal: Float
    customer: JSONObject
    remark: String
    sellerRemark: String
    remarkForMerchant: String
    charges: [JSONObject]

    paid: Boolean!
    sentOut: Boolean!
    trackingNum: String
    status: String
  }
`;

export default schema;
