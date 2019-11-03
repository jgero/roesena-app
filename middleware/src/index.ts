import express, { Response, Request } from 'express';
import expressGQL from 'express-graphql'

import { schema } from "./GraphQL/schema";
import { getAuthLevel } from './context';

// create the express-server instance
const app = express();
// use a middleware to parse the cookies
app.use(require('cookie-parser')());
// use the graphql middleware
app.use('/graphql', (req, res) => {
  return expressGQL({
    schema,
    graphiql: true,
    context: (async (request, response) => {
      const authLevel = await getAuthLevel(request);
      return {
        authLevel,
        request,
        response
      };
    })(req, res)
  })(req, res);
});
// start the graphql server
app.listen(4000, () => console.log('Express GraphQL Server running!'));
