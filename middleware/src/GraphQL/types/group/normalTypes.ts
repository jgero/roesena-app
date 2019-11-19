import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from 'graphql';
import { PersonType } from '../person';
import { getPersonById } from '../../../database/get/person';

export const GroupType = new GraphQLObjectType({
  name: 'Group',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    members: {
      type: GraphQLList(PersonType),
      resolve: async (parent, args, context) => {
        const auth = (await context).authLevel;
        if (parent.members) {
          return await Promise.all(
            (parent.members as string[]).map(personId => {
              return getPersonById(personId, auth);
            })
          );
        } else {
          return [];
        }
      }
    }
  })
});
