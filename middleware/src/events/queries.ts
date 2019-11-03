import { GraphQLList, GraphQLNonNull } from 'graphql';

import { Event } from "../interfaces"
import { ConnectionProvider } from "../connection";
import { EventType, TimeRangeInputType } from './types';

export const eventQueries = {
  events: {
    type: new GraphQLNonNull(GraphQLList(EventType)),
    resolve: events
  },
  eventsByDate: {
    type: new GraphQLNonNull(GraphQLList(EventType)),
    args: { input: { type: new GraphQLNonNull(TimeRangeInputType) } },
    resolve: eventsByDate,
  }
};

async function events(_a: any, _b: any, context: any): Promise<Event[]> {
  const auth = (await context).authLevel;
  const collection = (await ConnectionProvider.Instance.db).collection("events");
  return await collection.find({ authorityGroup: { $lte: auth } }).toArray();
}

async function eventsByDate(_: any, args: any, context: any): Promise<Event[]> {
  const auth = (await context).authLevel;
  const collection = (await ConnectionProvider.Instance.db).collection("events");
  return await collection.find({
    $and: [
      { authorityGroup: { $lte: auth } },
      { startDate: { $lte: args.input.endDate } },
      { endDate: { $gte: args.input.startDate } }
    ]
  }).toArray();
}
