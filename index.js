import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import typeDefs from'./server/schema';
import resolvers from'./server/resolver';
import connect from './server/connect';
import cookieParser from 'cookie-parser';

// import session from 'express-session';
// import passport from 'passport';
// import { GraphQLLocalStrategy, buildContext } from "graphql-passport";
// import bodyParser from 'body-parser';
// import UserModel from './server/model/user';
import { validateTokensMiddleware } from './server/utils/authentication';
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT;

const run = async () => {

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
      // console.log("ApolloServer",req.cookies['access'])
      // console.log("ApolloServer",req.cookies)
      if (req) {
        return {
          user: req.user ? req.user : null,
          req,
          res
        }
      }
    }
  });

  const app = express();

  const WHITE_LIST = [`http://localhost:${PORT}`, 'http://localhost:3001', 'http://localhost:3003', 'http://pwg.mananml.shop', 'http://store.mananml.shop', 'http://www.klklvapor.store']
  // if (process.env.WHITE_LIST) {
  //   WHITE_LIST.push(process.env.WHITE_LIST)
  // }
  const corsOptions = {
    origin: (origin, callback) => {
      if (WHITE_LIST.indexOf(origin) !== -1) {
          callback(null, true)
      } else {
          // callback(new Error("Not allowed by CORS"))
          callback(null, true)
      }
    },
    credentials: true
  };

  app.use(cors(corsOptions));
  app.use(cookieParser()); // cookieParser need to be placed before other app.use 

  app.use(validateTokensMiddleware);


  
  server.applyMiddleware({ app, cors: false });
  // server.applyMiddleware({ app, cors: corsOptions });
  // server.applyMiddleware({ app });

  // console.log("initDbConnection",connect.initDbConnection)
  global.connection = connect.initDbConnection();

  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  )
}

run();