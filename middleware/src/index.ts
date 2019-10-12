import express from 'express';
import expressGql from 'express-graphql';

import { buildSchema } from "graphql";
import fs from 'fs';

import { PersonResolver } from './person/personResolvers';
import { articles, article } from './article/articleResolvers';

const schema = buildSchema(
  fs.readFileSync('schema.graphql').toString()
);

const personRes = new PersonResolver();

const rootResolver = {
  persons: personRes.persons,
  person: personRes.person,
  articles: articles,
  article: article
}

const app = express();
app.use('/graphql', expressGql({
  schema: schema,
  rootValue: rootResolver,
  graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Server running!'));