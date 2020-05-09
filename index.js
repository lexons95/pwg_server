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

  const app = express();

  app.use(cookieParser()); // cookieParser need to be placed before other app.use 
  app.use(validateTokensMiddleware);

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

  const WHITE_LIST = [`http://localhost:${PORT}`, 'http://localhost:3003']
  if (process.env.WHITE_LIST) {
    WHITE_LIST.push(process.env.WHITE_LIST)
  }
  const corsOptions = {
    origin: WHITE_LIST,
    credentials: true,
    //saveUninitialized: true
  };
  // app.use(cors(corsOptions));
  app.use(cors());

  server.applyMiddleware({ app, cors: true });
// console.log("initDbConnection",connect.initDbConnection)
  global.connection = connect.initDbConnection();
  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  )
}

run();