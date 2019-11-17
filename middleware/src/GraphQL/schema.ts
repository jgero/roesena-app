import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import authQueries from './queries/AuthQueries';
import authMutations from './mutations/AuthMutations';
import eventQueries from './queries/EventQueries';
import { eventMutations } from '../events';
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
