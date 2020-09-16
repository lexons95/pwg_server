import { gql } from 'apollo-server-express';

const schema = gql`
  extend type Query {
    qiniuToken: Response!
    getS3SignedUrl(bucketName: String!, Key: String!, ContentType: String!): Response!
    getManyS3SignedUrl(bucketName: String!, objects: [JSONObject!]): Response!
  }
  extend type Mutation {
    qiniuBatchDelete(images: [String!]): Response!
    qiniuBatchCopy(images: [String!]): Response!

    s3ListObjects(bucketName: String!): Response!
    s3DeleteOne(bucketName: String!, Key: String!): Response!
    s3DeleteMany(bucketName: String!, Keys: [String!]): Response!
    
    s3UploadOne(name: String!, file: Upload!): Response!
  }
`;
export default schema;