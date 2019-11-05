import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { eventQueries, eventMutations } from '../events';
import { authQueries, authMutations } from '../auth';
import { personQueries, personMutations } from '../person';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      ...eventQueries,
      ...authQueries,
      ...personQueries
    })
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      ...eventMutations,
      ...authMutations,
      ...personMutations
    })
  })
});
