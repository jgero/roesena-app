import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import authQueries from './queries/AuthQueries';
import authMutations from './mutations/AuthMutations';
import eventQueries from './queries/EventQueries';
import eventMutations from './mutations/EventMutations';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      ...authQueries,
      ...eventQueries
    })
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      ...authMutations,
      ...eventMutations
    })
  })
});
