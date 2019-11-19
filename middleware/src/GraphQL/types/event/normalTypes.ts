import { GraphQLString, GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList } from 'graphql';

import { PersonType } from '../person';
import { getPersonById } from '../../../database/get/person';

const ParticipantType = new GraphQLObjectType({
  name: 'Participant',
  fields: () => ({
    person: {
      type: GraphQLNonNull(PersonType),
      resolve: async (parent, args, context) => {
        if (!parent._id) {
          return undefined;
        }
        const auth = (await context).authLevel;
        return getPersonById(parent._id, auth);
      }
    },
    amount: {
      type: GraphQLInt,
      resolve: (parent, args, context) => {
        if (!parent.amount || parent.amount === null) {
          return undefined;
        } else {
          return parent.amount;
        }
      }
    }
  })
});

export const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    startDate: { type: GraphQLNonNull(GraphQLInt) },
    endDate: { type: GraphQLNonNull(GraphQLInt) },
    authorityLevel: { type: GraphQLNonNull(GraphQLInt) },
    participants: { type: GraphQLNonNull(GraphQLList(ParticipantType)) }
  })
});
