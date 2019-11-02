import { ObjectID } from "mongodb";
import { Request } from "express";

import { Event, Person } from "../interfaces"
import { ConnectionProvider } from "../connection";

export async function newEvent(
  args: { input: { title: string, description: string, startDate: number, endDate: number, participants: string[], authorityGroup: number } }
): Promise<Event> {
  const { title, description, startDate, endDate, participants, authorityGroup } = args.input;
  const collection = (await ConnectionProvider.Instance.db).collection("events");
  return new Promise((resolve) => {
    collection.insertOne({ title, description, startDate, endDate, participants, authorityGroup }).then(result => {
      // the result.ops[0] contains the data that was inserted by the query
      resolve(result.ops[0] as Event);
    })
  });
}

export async function updateEvent(
  args: { input: { _id: string, title: string, description: string, startDate: number, endDate: number, participants: string[], authorityGroup: number } }
): Promise<Event> {
  const { _id, title, description, startDate, endDate, participants, authorityGroup } = args.input;
  const collection = (await ConnectionProvider.Instance.db).collection("events");
  return new Promise((resolve) => {
    collection.findOneAndUpdate({ _id: new ObjectID(_id) }, { $set: { title, description, startDate, endDate, participants, authorityGroup } }).then(result => {
      resolve(result.value as Event);
    });
  });
}

export async function acceptEvent({ _id }: { _id: string }, context: any): Promise<boolean> {
  const personCollection = (await ConnectionProvider.Instance.db).collection("persons");
  const eventCollection = (await ConnectionProvider.Instance.db).collection("events");
  const req: Request = (await context).request;
  // get logged-in user
  const user = await personCollection.findOne<Person>({ sessionId: req.cookies.session_token });
  if (user) {
    // get the event which should be accepted
    const event = await eventCollection.findOne<Event>({ _id: new ObjectID(_id) });
    // because of some type problems the participants have to be compared with only two '=' symbols
    if (event && event.participants.find(el => el == user._id)) {
      // only accept if person is an participant and has not already accepted
      const result = await eventCollection.updateOne({ _id: new ObjectID(_id) }, { $addToSet: { accepted: user._id } });
      return Promise.resolve(result.modifiedCount === 1);
    }
  }
  return Promise.resolve(false);
}
