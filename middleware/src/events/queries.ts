import { GraphQLList, GraphQLNonNull } from 'graphql';

import { ConnectionProvider } from '../connection';
import { EventType, TimeRangeInputType } from './types';
import { ObjectID } from 'bson';

export const eventQueries = {
  events: {
    type: new GraphQLNonNull(GraphQLList(EventType)),
    resolve: events
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
  if (auth > 1) {
    return await mapIdsToPersons(await collection.find({ authorityGroup: { $lte: auth } }).toArray());
  } else {
    return [];
  }
}

async function eventsByDate(_: any, args: any, context: any) {
  const auth = (await context).authLevel;
  const collection = (await ConnectionProvider.Instance.db).collection('events');
  if (auth > 1) {
    return await mapIdsToPersons(
      await collection
        .find({
          $and: [
            { authorityGroup: { $lte: auth } },
            { startDate: { $lte: args.input.endDate } },
            { endDate: { $gte: args.input.startDate } }
          ]
        })
        .toArray()
    );
  } else {
    return [];
  }
}

export async function mapIdsToPersons(event) {
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  return event.map(async event => {
    event.participants = await event.participants.map(async el => {
      // el contains the id of the person and the amount it accepted with
      const person = await collection.findOne({ _id: new ObjectID(el._id) });
      return {
        person,
        amount: el.amount
      };
    });
    return event;
  });
}
