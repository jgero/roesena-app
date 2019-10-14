import express, { Response, Request } from 'express';
import expressGql from 'express-graphql'
import { buildSchema } from "graphql";
import fs from 'fs';

import { PersonResolver } from './person/personResolvers';
import { articles, article } from './article/articleResolvers';
import { ContextMaker } from './context';

(() => {
  // create the express-server instance
  const app = express();
  // use a middleware to parse the cookies
  app.use(require('cookie-parser')());
  // resolver for persons
  const personRes = new PersonResolver();
  // the actual graphql handler
  app.use('/graphql', (req, res) => {
    return expressGql({
      schema: buildSchema(
        fs.readFileSync('schema.graphql').toString()
      ),
      // errors in the resolvers do not have to be catched, the gql lib will automatically catch them and put them into the response
      // first argument in the handler funcs are the arguments, the second part is the context
      // root is part of the context???
      rootValue: {
        persons: personRes.persons,
        person: personRes.person,
        articles: articles,
        article: article
      },
      graphiql: true,
      // the context contains the authLevel of the user from the current cookie, aswell as the request and the response
      // context is async, which means it returns a Promise!
      context: (async (request: Request, response: Response) => {
        const maker = new ContextMaker(request);
        const authLevel = await maker.getAuthLevel();
        return {
          authLevel,
          request,
          response
        }
      })(req, res)
    })(req, res);
  });
  app.listen(4000, () => console.log('Express GraphQL Server running!'));
})();
