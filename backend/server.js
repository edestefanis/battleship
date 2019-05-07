import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer, gql } from 'apollo-server-express';
import http from 'http';

import { PubSub } from 'apollo-server-express';

import mongoose from 'mongoose';

import typeDefs from './src/typeDefs';
import Query from './src/resolvers/Query';
import Mutation from './src/resolvers/Mutation';
import Subscription from './src/resolvers/Subscription';
import Game from './src/resolvers/Game';
 
// Provide resolver functions for your schema fields
const resolvers = {
    Query,
    Mutation,
    Subscription,
    Game
};
 
const pubsub = new PubSub();

const app = express();

mongoose.connect('mongodb+srv://sony:FvCxfjmAG37v7zUx@cluster0-jw9nq.mongodb.net/node-angular?retryWrites=true')
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

const port = '4000'

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        pubsub
    }
});

server.applyMiddleware({app});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`);
});