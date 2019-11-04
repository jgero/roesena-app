import { GraphQLNonNull, GraphQLBoolean, GraphQLID } from 'graphql';
import { ObjectID } from "mongodb";
import { Request } from "express";

import { Event, Person } from "../interfaces"
import { ConnectionProvider } from "../connection";
import { EventType, NewEventInputType, UpdateEventInputType, AcceptEventInputType } from './types';

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
  }
};

async function newEvent(_: any, args: any, context: any): Promise<string> {
  const collection = (await ConnectionProvider.Instance.db).collection("events");
  const auth = (await context).authLevel;
  if (auth >= 3 && auth >= args.input.authorityGroup) {
    const result = await collection.insertOne(args.input);
    // return the id of the inserted Event
    return (result.insertedId as string);
  }
  return "";
}

async function updateEvent(_: any, args: any, context: any): Promise<Event | null> {
  const collection = (await ConnectionProvider.Instance.db).collection("events");
  const auth = (await context).authLevel;
  // find old event to check if editing should be allowed
  const old = await collection.findOne<Event>({ _id: new ObjectID(args.input._id) });
  if (old && auth >= 3 && auth >= old.authorityGroup) {
    const id = args.input._id;
    delete args.input._id;
    const result = await collection.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: args.input });
    return result.value;
  }
  return null;
}

// when amount in participant is not set the person has not accepted yet
// add mutation to unset the amount again to cancel if already accepted

async function acceptEvent(_: any, args: any, context: any): Promise<boolean> {
  const { _id, amount } = args.input;
  const personCollection = (await ConnectionProvider.Instance.db).collection("persons");
  const eventCollection = (await ConnectionProvider.Instance.db).collection("events");
  const req: Request = (await context).request;
  // get logged-in user
  const user = await personCollection.findOne({ sessionId: req.cookies.session_token });
  if (user) {
    const result = await eventCollection.updateOne(
      // match by event id and the person id in the participants so only events the user is participant of match
      { _id: new ObjectID(_id), "participants._id": (user._id as ObjectID).toHexString() },
      // update the amount for the matched participant
      { $set: { "participants.$.amount": amount } }
    );
    return result.modifiedCount === 1;
  }
  return false;
}

async function deleteEvent(_: any, args: any, context: any): Promise<boolean> {
  const _id = args._id;
  const collection = (await ConnectionProvider.Instance.db).collection("events");
  return new Promise((resolve) => {
    collection.deleteOne({ _id: new ObjectID(_id) }).then(result => {
      resolve(result.deletedCount === 1);
    });
  });
}
