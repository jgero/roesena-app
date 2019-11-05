import {
  GraphQLString,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt
} from 'graphql';

import { ImageType } from '../image/types';

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

export const NewArticleInputType = new GraphQLInputObjectType({
  name: 'NewArticleInputType',
  fields: () => ({
    date: { type: GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLNonNull(GraphQLString) },
    images: { type: GraphQLNonNull(GraphQLList(GraphQLString)) }
  })
});

export const UpdateArticleInputType = new GraphQLInputObjectType({
  name: 'UpdateArticleInputType',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    date: { type: GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLNonNull(GraphQLString) },
    images: { type: GraphQLNonNull(GraphQLList(GraphQLString)) }
  })
});
