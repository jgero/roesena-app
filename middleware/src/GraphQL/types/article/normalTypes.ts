import { GraphQLString, GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLInt } from 'graphql';

import { ImageType } from '../image';

export const ArticleType = new GraphQLObjectType({
  name: 'Article',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    date: { type: GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLNonNull(GraphQLString) },
    images: { type: GraphQLNonNull(GraphQLList(ImageType)) }
  })
});
