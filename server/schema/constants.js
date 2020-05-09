import { gql } from 'apollo-server-express';

const schema = gql`
  extend type Query {
    userConfig(configId: String!): Response!
    qiniuToken: Response!
  }
  extend type Mutation {
    qiniuBatchDelete(images: [String!]): Response!
    updateConfig(configId: String!, config: JSONObject): Response!
  }
`;
export default schema;