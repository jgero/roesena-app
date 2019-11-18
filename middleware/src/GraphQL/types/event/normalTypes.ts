import { GraphQLString, GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList } from 'graphql';
import { ObjectID } from 'bson';

import { PersonType } from '../person';
import { ConnectionProvider } from '../../../database/connection';

const ParticipantType = new GraphQLObjectType({
  name: 'Participant',
  fields: () => ({
    person: {
      type: GraphQLNonNull(PersonType),
      resolve: async (parent, args, context) => {
        if (!parent._id) {
          return undefined;
        }
        const collection = (await ConnectionProvider.Instance.db).collection('persons');
        return await collection.findOne({ _id: new ObjectID(parent._id) });
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
    authorityGroup: { type: GraphQLNonNull(GraphQLInt) },
    participants: { type: GraphQLNonNull(GraphQLList(ParticipantType)) }
  })
});
