import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer, gql } from 'apollo-server-express';

import mongoose from 'mongoose';

import typeDefs from './src/typeDefs';
import Query from './src/resolvers/Query';
import Mutation from './src/resolvers/Mutation';
import Game from './src/resolvers/Game';

 
// Provide resolver functions for your schema fields
const resolvers = {
    Query,
    Mutation,
    Game
};
 
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
    playground: {
        endpoint: `http://localhost:${port}/graphql`,
        settings: {
            'editor.theme': 'light'
        }
    }
});
server.applyMiddleware({app});
 
app.listen(port, () => console.log('Express server running on port 4000'));