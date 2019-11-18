import { GraphQLString, GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLList, GraphQLInt } from 'graphql';

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
