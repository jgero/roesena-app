import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { eventQueries, eventMutations } from '../events';
import { authQueries, authMutations } from '../auth';
import { personQueries, personMutations } from '../person';
import { imageQueries, imageMutations } from '../image';
import { articleQueries, articleMutations } from '../article';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      ...eventQueries,
      ...authQueries,
      ...personQueries,
      ...imageQueries,
      ...articleQueries
    })
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      ...eventMutations,
      ...authMutations,
      ...personMutations,
      ...imageMutations,
      ...articleMutations
    })
  })
});
