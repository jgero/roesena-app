import { GraphQLString, GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';

export const ImageType = new GraphQLObjectType({
  name: 'Image',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    description: { type: GraphQLNonNull(GraphQLString) },
    data: { type: GraphQLNonNull(GraphQLString) },
    tags: { type: GraphQLNonNull(GraphQLList(GraphQLString)) }
  })
});
