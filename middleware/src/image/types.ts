import { GraphQLString, GraphQLID, GraphQLInputObjectType, GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';

export const ImageType = new GraphQLObjectType({
  name: 'Image',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    description: { type: GraphQLNonNull(GraphQLString) },
    data: { type: GraphQLNonNull(GraphQLString) },
    tags: { type: GraphQLNonNull(GraphQLList(GraphQLString)) }
  })
});

export const NewImageInputType = new GraphQLInputObjectType({
  name: 'NewImageInputType',
  fields: () => ({
    description: { type: GraphQLNonNull(GraphQLString) },
    data: { type: GraphQLNonNull(GraphQLString) },
    tags: { type: GraphQLNonNull(GraphQLList(GraphQLString)) }
  })
});

export const UpdateImageInputType = new GraphQLInputObjectType({
  name: 'UpdateImageInputType',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    description: { type: GraphQLNonNull(GraphQLString) },
    data: { type: GraphQLNonNull(GraphQLString) },
    tags: { type: GraphQLNonNull(GraphQLList(GraphQLString)) }
  })
});
