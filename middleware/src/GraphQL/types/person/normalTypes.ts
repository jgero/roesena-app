import { GraphQLString, GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';

export const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorityLevel: { type: GraphQLNonNull(GraphQLInt) }
  })
});
