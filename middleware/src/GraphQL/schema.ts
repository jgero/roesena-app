import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import articleQueries from './queries/ArticleQueries';
import articleMutations from './mutations/ArticleMutations';
import authQueries from './queries/AuthQueries';
import authMutations from './mutations/AuthMutations';
import eventQueries from './queries/EventQueries';
import eventMutations from './mutations/EventMutations';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      ...articleQueries,
      ...authQueries,
      ...eventQueries
    })
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      ...articleMutations,
      ...authMutations,
      ...eventMutations
    })
  })
});
