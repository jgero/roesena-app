import express from 'express';
import expressGQL from 'express-graphql';

import { schema } from './GraphQL/schema';
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
let server;
function startServer() {
  server = app.listen(4000, () => console.log('Express GraphQL Server running!'));
}
startServer();

declare const module: any;

// webpack hot reloading
if (module.hot) {
  module.hot.accept(() => {
    if (server) {
      server.close();
    }
    startServer();
    // if(server) {
    //   server.close();
    // } else {
    //   startServer();
    // }
  });
  // when changes were detected app needs to restart -> shut down server here
  module.hot.dispose(() => server.close());
}
