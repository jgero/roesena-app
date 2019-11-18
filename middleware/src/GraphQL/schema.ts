import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import articleQueries from './queries/ArticleQueries';
import articleMutations from './mutations/ArticleMutations';
import authQueries from './queries/AuthQueries';
import authMutations from './mutations/AuthMutations';
import eventQueries from './queries/EventQueries';
import eventMutations from './mutations/EventMutations';
import imageQueries from './queries/ImageQueries';
import imageMutations from './mutations/ImageMutations';
import personQueries from './queries/PersonQueries';
import personMutations from './mutations/PersonMutations';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      ...articleQueries,
      ...authQueries,
      ...eventQueries,
      ...imageQueries,
      ...personQueries
    })
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      ...articleMutations,
      ...authMutations,
      ...eventMutations,
      ...imageMutations,
      ...personMutations
    })
  })
});
