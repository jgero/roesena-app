import { GraphQLString, GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLInt, GraphQLList } from 'graphql';

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
    authorityLevel: { type: GraphQLNonNull(GraphQLInt) },
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
    authorityLevel: { type: GraphQLNonNull(GraphQLInt) },
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
