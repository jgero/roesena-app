import { GraphQLString, GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLList } from 'graphql';

export const NewGroupInputType = new GraphQLInputObjectType({
  name: 'NewGroupInputType',
  fields: () => ({
    name: { type: GraphQLNonNull(GraphQLString) },
    members: { type: GraphQLNonNull(GraphQLList(GraphQLString)) }
  })
});

export const UpdateGroupInputType = new GraphQLInputObjectType({
  name: 'UpdateGroupInputType',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    members: { type: GraphQLNonNull(GraphQLList(GraphQLString)) }
  })
});
