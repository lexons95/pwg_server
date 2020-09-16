import { AuthenticationError, ApolloError } from 'apollo-server-express';
import { editorOnly } from '../utils/authentication';
import awsS3API from '../utils/awsS3API';

const resolvers = {
  Query: {
    getS3SignedUrl: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser && loggedInUser.configId ? loggedInUser.configId : null;
      if (configId) {
        let AWSS3API = await awsS3API();
        let urlResult = await AWSS3API.generatePutUrl(configId, args.Key, args.ContentType)
        return {
          success: true,
          message: "URL generated",
          data: urlResult
        }
      }
      return new ApolloError("Config not found");
    }),
    getManyS3SignedUrl: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser && loggedInUser.configId ? loggedInUser.configId : null;
      if (configId) {
        let AWSS3API = await awsS3API();
        let urlResult = await AWSS3API.generateManyPutUrl(configId, args.objects)
        return {
          success: true,
          message: "URL generated",
          data: urlResult
        }
      }
      return new ApolloError("Config not found");
    })
  },
  Mutation: {
    s3UploadOne: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser && loggedInUser.configId ? loggedInUser.configId : null;
      if (configId) {
        let AWSS3API = await awsS3API();
        let uploadResult = await AWSS3API.uploadOne(configId, args.name, args.file)
        uploadResult.then(result=>{
          return result;
        }).catch(err=>{
          console.log('Upload err',err)
          return new ApolloError("Upload failed");
        });
      }
      return new ApolloError("Config not found");
    }),
    s3DeleteOne: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser && loggedInUser.configId ? loggedInUser.configId : null;
      if (configId) {
        let AWSS3API = await awsS3API();
        let deleteResult = await AWSS3API.deleteOne(configId, args.Key);
        return {
          success: true,
          message: "Object deleted",
          data: deleteResult
        }
      }
      return new ApolloError("Config not found");
    }),
    s3DeleteMany: editorOnly( async (_, args={}, { req }) => {
      let loggedInUser = req.user;
      let configId = loggedInUser && loggedInUser.configId ? loggedInUser.configId : null;
      if (configId) {
        let AWSS3API = await awsS3API();
        let deleteResult = await AWSS3API.deleteMany(configId, args.Keys);
        return {
          success: true,
          message: "Objects deleted",
          data: deleteResult
        }
      }
      return new ApolloError("Config not found");
    }),
  }
};

export default resolvers;
