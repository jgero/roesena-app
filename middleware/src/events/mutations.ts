import { GraphQLNonNull, GraphQLBoolean, GraphQLID } from 'graphql';
import { ObjectID } from 'mongodb';
import { Request } from 'express';

import { ConnectionProvider } from '../connection';
import { EventType, NewEventInputType, UpdateEventInputType, AcceptEventInputType } from './types';
import { mapIdsToPersons } from './queries';

export const eventMutations = {
  newEvent: {
    type: EventType,
    args: { input: { type: new GraphQLNonNull(NewEventInputType) } },
    resolve: newEvent
  },
  updateEvent: {
    type: EventType,
    args: { input: { type: new GraphQLNonNull(UpdateEventInputType) } },
    resolve: updateEvent
  },
  deleteEvent: {
    type: GraphQLBoolean,
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: deleteEvent
  },
  acceptEvent: {
    type: GraphQLBoolean,
    args: { input: { type: new GraphQLNonNull(AcceptEventInputType) } },
    resolve: acceptEvent
  },
  cancelEvent: {
    type: GraphQLBoolean,
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: cancelEvent
  }
};

async function newEvent(_: any, args: any, context: any) {
  const collection = (await ConnectionProvider.Instance.db).collection('events');
  const auth = (await context).authLevel;
  // only group leaders or higher are allowed to update events
  // you can only create events at your auth level or lower
  if (auth > 2 && auth >= args.input.authorityGroup) {
    const result = await collection.insertOne(args.input);
    // return the new event (with all participants)
    if (result.insertedCount > 0) {
      return (await mapIdsToPersons([result.ops[0]]))[0];
    }
  }
  return null;
}

async function updateEvent(_: any, args: any, context: any) {
  const collection = (await ConnectionProvider.Instance.db).collection('events');
  const auth = (await context).authLevel;
  // only group leaders or higher are allowed to update events
  if (auth > 2) {
    const id = args.input._id;
    delete args.input._id;
    const result = await collection.findOneAndUpdate(
      // match the desired event if the authLevel of the user is high enough
      { _id: new ObjectID(id), authorityGroup: { $lte: auth } },
      // update the provided elements
      { $set: args.input },
      { returnOriginal: false }
    );
    return (await mapIdsToPersons([result.value]))[0];
  }
  return null;
}

// not needed !!!!!
// to cancel an event amount is set to 0!
async function cancelEvent(_: any, args: any, context: any) {
  const personCollection = (await ConnectionProvider.Instance.db).collection('persons');
  const eventCollection = (await ConnectionProvider.Instance.db).collection('events');
  const req: Request = (await context).request;
  // get logged-in user
  const user = await personCollection.findOne({ sessionId: req.cookies.session_token });
  if (user) {
    const result = await eventCollection.updateOne(
      // match by event id and the person id in the participants so only events the user is participant of match
      { _id: new ObjectID(args._id), 'participants._id': (user._id as ObjectID).toHexString() },
      // unset the amount for the matched participant
      { $unset: { 'participants.$.amount': '' } }
    );
    return result.modifiedCount === 1;
  }
  return false;
}

async function acceptEvent(_: any, args: any, context: any) {
  const { _id, amount } = args.input;
  const personCollection = (await ConnectionProvider.Instance.db).collection('persons');
  const eventCollection = (await ConnectionProvider.Instance.db).collection('events');
  const req: Request = (await context).request;
  // get logged-in user
  const user = await personCollection.findOne({ sessionId: req.cookies.session_token });
  if (user) {
    const result = await eventCollection.updateOne(
      // match by event id and the person id in the participants so only events the user is participant of match
      { _id: new ObjectID(_id), 'participants._id': (user._id as ObjectID).toHexString() },
      // update the amount for the matched participant
      { $set: { 'participants.$.amount': amount } }
    );
    return result.modifiedCount === 1;
  }
  return false;
}

async function deleteEvent(_: any, args: any, context: any) {
  const _id = args._id;
  const collection = (await ConnectionProvider.Instance.db).collection('events');
  return new Promise(resolve => {
    collection.deleteOne({ _id: new ObjectID(_id) }).then(result => {
      resolve(result.deletedCount === 1);
    });
  });
}
