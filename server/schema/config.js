import { gql } from 'apollo-server-express';

const schema = gql`
  extend type Query {
    userConfig(configId: String!): Response!
  }
  extend type Mutation {
    updateConfig(config: JSONObject, configId: String!): Response!
  }
`;
export default schema;