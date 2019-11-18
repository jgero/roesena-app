import { ObjectID } from 'bson';

import { Event } from '../../interfaces';
import { ConnectionProvider } from '../connection';

export async function createEvent(newEvent: Event, auth: number): Promise<Event | null> {
  const collection = (await ConnectionProvider.Instance.db).collection('events');
  // only group leaders or higher are allowed to update events
  // you can only create events at your auth level or lower
  if (auth > 2 && auth >= newEvent.authorityLevel) {
    const result = await collection.insertOne(newEvent);
    // return the new event (with all participants)
    if (result.insertedCount > 0) {
      return result.ops[0] as Event;
    }
  }
  return null;
}

export async function updateEvent(eventToUpdate: Event, auth: number): Promise<Event | null> {
  const collection = (await ConnectionProvider.Instance.db).collection('events');
  // only group leaders or higher are allowed to update events
  if (auth > 2) {
    const id = eventToUpdate._id;
    delete eventToUpdate._id;
    const result = await collection.findOneAndUpdate(
      // match the desired event if the authLevel of the user is high enough
      { _id: new ObjectID(id), authorityLevel: { $lte: auth } },
      // update the provided elements
      { $set: { ...eventToUpdate } },
      { returnOriginal: false }
    );
    return result.value;
  }
  return null;
}

export async function acceptEventForUserBySessionIdWithAmount(
  sessionId: string,
  eventId: string,
  amount: number
): Promise<boolean> {
  const personCollection = (await ConnectionProvider.Instance.db).collection('persons');
  const eventCollection = (await ConnectionProvider.Instance.db).collection('events');
  // get logged-in user
  const user = await personCollection.findOne({ sessionId });
  if (user) {
    const result = await eventCollection.updateOne(
      // match by event id and the person id in the participants so only events the user is participant of match
      { _id: new ObjectID(eventId), 'participants._id': (user._id as ObjectID).toHexString() },
      // update the amount for the matched participant
      { $set: { 'participants.$.amount': amount } }
    );
    return result.modifiedCount === 1;
  }
  return false;
}

export async function deleteEvent(eventId: string, auth: number): Promise<boolean> {
  // only group leaders or higher are allowed to delete events
  if (auth > 2) {
    const collection = (await ConnectionProvider.Instance.db).collection('events');
    const result = await collection.deleteOne({ _id: new ObjectID(eventId) });
    return result.deletedCount === 1;
  } else {
    return false;
  }
}
