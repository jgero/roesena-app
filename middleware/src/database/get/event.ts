import { ConnectionProvider } from '../connection';

import { Event } from '../../interfaces';
import { ObjectID } from 'bson';

export async function getAllEvents(userAuthLevel: number): Promise<Event[]> {
  const collection = (await ConnectionProvider.Instance.db).collection('events');
  // only get events if it is at or below the user's authorityLevel
  let res = await collection
    .find<Event>({ authorityLevel: { $lte: userAuthLevel } })
    .toArray();
  // if not logged in remove the participants
  if (userAuthLevel < 2) {
    res.map(el => {
      el.participants = [];
      return el;
    });
  }
  return res;
}

export async function getEventById(userAuthLevel: number, id: string): Promise<Event | null> {
  const collection = (await ConnectionProvider.Instance.db).collection('events');
  // only get event if it is at or below the user's authorityLevel
  let res = await collection.findOne<Event>({ _id: new ObjectID(id), authorityLevel: { $lte: userAuthLevel } });
  // if not logged in remove the participants
  if (userAuthLevel < 2 && res) {
    res.participants = [];
    return res;
  }
  return res;
}

export async function getEventsByDate(userAuthLevel: number, startDate: number, endDate: number): Promise<Event[]> {
  const collection = (await ConnectionProvider.Instance.db).collection('events');
  // only get events if it is at or below the user's authorityLevel
  let res = await collection
    .find<Event>({
      $and: [{ authorityLevel: { $lte: userAuthLevel } }, { startDate: { $lte: endDate } }, { endDate: { $gte: startDate } }]
    })
    .toArray();
  // if not logged in remove the participants
  if (userAuthLevel < 2) {
    res.map(el => {
      el.participants = [];
      return el;
    });
  }
  return res;
}
