import { gql } from 'apollo-server-express';

const schema = gql`
  extend type Query {
    users(filter: JSONObject): [User]!
    user(id: String!): User
    loggedInUser: Response
  }
  extend type Mutation {
    createUser(user: JSONObject!): Response!
    updateUser(user: JSONObject!): Response!
    deleteUser(id: String!): Response!

    loginUser(user: JSONObject!): Response!
    changeUserPassword(user: JSONObject!): Response!
    login(user: JSONObject): Response
    logout: Response
  }

  type User {
    _id: String,
    username: String!,
    password: String!,
    email: String,
    role: String,,
    config_id: String,
    profile: UserProfile,
    tokenCount: Float
  }

  type UserProfile {
    icNum: String 
    name: String,
    contact: String
    addresses: [JSONObject!]!
  }
`;
export default schema;