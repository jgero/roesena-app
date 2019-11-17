import { GraphQLString, GraphQLID, GraphQLInputObjectType, GraphQLNonNull } from 'graphql';

export const LoginInputType = new GraphQLInputObjectType({
  name: 'LoginInputType',
  fields: () => ({
    name: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) }
  })
});

export const ChangePwInputType = new GraphQLInputObjectType({
  name: 'ChangePwInputType',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    password: { type: GraphQLNonNull(GraphQLString) }
  })
});
