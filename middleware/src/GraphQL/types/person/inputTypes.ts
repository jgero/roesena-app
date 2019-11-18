import { GraphQLString, GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';

export const NewPersonInputType = new GraphQLInputObjectType({
  name: 'NewPersonInputType',
  fields: () => ({
    name: { type: GraphQLNonNull(GraphQLString) },
    authorityLevel: { type: GraphQLNonNull(GraphQLInt) }
  })
});

export const UpdatePersonInputType = new GraphQLInputObjectType({
  name: 'UpdatePersonInputType',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorityLevel: { type: GraphQLNonNull(GraphQLInt) }
  })
});
