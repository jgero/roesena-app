import { GraphQLNonNull, GraphQLList, GraphQLID } from 'graphql';

import { EventType, TimeRangeInputType } from '../types';
import { getAllEvents, getEventById, getEventsByDate } from '../../database/get/event';

export default {
  events: {
    type: new GraphQLNonNull(GraphQLList(EventType)),
    resolve: async (root: any, args: any, context: any) => {
      const userAuthLevel = (await context).authLevel;
      return getAllEvents(userAuthLevel);
    }
  },
  event: {
    type: EventType,
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: async (root: any, args: any, context: any) => {
      const userAuthLevel = (await context).authLevel;
      return getEventById(userAuthLevel, args._id);
    }
  },
  eventsByDate: {
    type: new GraphQLNonNull(GraphQLList(EventType)),
    args: { input: { type: new GraphQLNonNull(TimeRangeInputType) } },
    resolve: async (root: any, args: any, context: any) => {
      const userAuthLevel = (await context).authLevel;
      return getEventsByDate(userAuthLevel, args.input.startDate, args.input.endDate);
    }
  }
};
