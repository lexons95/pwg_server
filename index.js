import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import typeDefs from'./server/schema';
import resolvers from'./server/resolver';
import connect from './server/connect';

const PORT = 5003;

const run = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
      if (req) {
        return {
            connection: connect.initDbConnection(),
            req
        }
    }
    }
  });

  app.use(cors());
  server.applyMiddleware({ app });
// console.log("initDbConnection",connect.initDbConnection)
  // global.connection = connect.initDbConnection();
  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  )
}

run();