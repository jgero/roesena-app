import {
  GraphQLString,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList
} from 'graphql';

import { PersonType } from '../person/types';
import { ConnectionProvider } from '../database/connection';
import { ObjectID } from 'bson';

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

const ParticipantInputType = new GraphQLInputObjectType({
  name: 'ParticipantInputType',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    amount: { type: GraphQLInt }
  })
});

export const NewEventInputType = new GraphQLInputObjectType({
  name: 'NewEventInputType',
  fields: () => ({
    title: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    startDate: { type: GraphQLNonNull(GraphQLInt) },
    endDate: { type: GraphQLNonNull(GraphQLInt) },
    authorityGroup: { type: GraphQLNonNull(GraphQLInt) },
    participants: { type: GraphQLNonNull(GraphQLList(ParticipantInputType)) }
  })
});

export const UpdateEventInputType = new GraphQLInputObjectType({
  name: 'UpdateEventInputType',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    startDate: { type: GraphQLNonNull(GraphQLInt) },
    endDate: { type: GraphQLNonNull(GraphQLInt) },
    authorityGroup: { type: GraphQLNonNull(GraphQLInt) },
    participants: { type: GraphQLNonNull(GraphQLList(ParticipantInputType)) }
  })
});

export const TimeRangeInputType = new GraphQLInputObjectType({
  name: 'TimeRangeInputType',
  fields: () => ({
    startDate: { type: GraphQLNonNull(GraphQLInt) },
    endDate: { type: GraphQLNonNull(GraphQLInt) }
  })
});

export const AcceptEventInputType = new GraphQLInputObjectType({
  name: 'AcceptEventInputType',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    amount: { type: GraphQLNonNull(GraphQLInt) }
  })
});
