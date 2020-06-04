import { gql } from 'apollo-server-express';

const schema = gql`
  extend type Query {
    userConfig(configId: String!): Response!
    qiniuToken: Response!
  }
  extend type Mutation {
    qiniuBatchDelete(images: [String!]): Response!
    qiniuBatchCopy(images: [String!]): Response!
    updateConfig(config: JSONObject, configId: String!): Response!
  }
`;
export default schema;