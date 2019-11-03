import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { eventQueries, eventMutations } from '../events';
import { authQueries, authMutations } from '../auth';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      ...eventQueries,
      ...authQueries
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      ...eventMutations,
      ...authMutations
    }),
  }),
});
