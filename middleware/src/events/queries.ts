import { GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';

import { ConnectionProvider } from '../database/connection';
import { EventType, TimeRangeInputType } from './types';
import { ObjectID } from 'bson';

export const eventQueries = {
  events: {
    type: new GraphQLNonNull(GraphQLList(EventType)),
    resolve: events
  },
  event: {
    type: EventType,
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: event
  },
  eventsByDate: {
    type: new GraphQLNonNull(GraphQLList(EventType)),
    args: { input: { type: new GraphQLNonNull(TimeRangeInputType) } },
    resolve: eventsByDate
  }
};

async function events(_a: any, _b: any, context: any) {
  const auth = (await context).authLevel;
  const collection = (await ConnectionProvider.Instance.db).collection('events');
  // only get events if it is at or below the user's authorityLevel
  let res = await collection.find({ authorityGroup: { $lte: auth } }).toArray();
  // if not logged in remove the participants
  if (auth < 2) {
    res.map(el => {
      el.participants = [];
      return el;
    });
  }
  return res;
}

async function event(_a: any, args: any, context: any) {
  const auth = (await context).authLevel;
  const collection = (await ConnectionProvider.Instance.db).collection('events');
  // only get event if it is at or below the user's authorityLevel
  let res = await collection.findOne({ _id: new ObjectID(args._id), authorityGroup: { $lte: auth } });
  // if not logged in remove the participants
  if (auth < 2) {
    res.map(el => {
      el.participants = [];
      return el;
    });
  }
  return res;
}

async function eventsByDate(_: any, args: any, context: any) {
  const auth = (await context).authLevel;
  const collection = (await ConnectionProvider.Instance.db).collection('events');
  // only get events if it is at or below the user's authorityLevel
  let res = await collection
    .find({
      $and: [
        { authorityGroup: { $lte: auth } },
        { startDate: { $lte: args.input.endDate } },
        { endDate: { $gte: args.input.startDate } }
      ]
    })
    .toArray();
  // if not logged in remove the participants
  if (auth < 2) {
    res.map(el => {
      el.participants = [];
      return el;
    });
  }
  return res;
}
