import { gql } from 'apollo-server-express';

const schema = gql`
  extend type Query {
    userConfig(configId: String!): Response!
    qiniuToken: Response!
    getS3PutUrl(bucketName: String!, Key: String!, ContentType: String!): Response!
  }
  extend type Mutation {
    qiniuBatchDelete(images: [String!]): Response!
    qiniuBatchCopy(images: [String!]): Response!
    updateConfig(config: JSONObject, configId: String!): Response!
    s3Delete(images: [String!]): Response!
    s3UploadOne(name: String!, file: Upload!): Response!
  }
`;
export default schema;