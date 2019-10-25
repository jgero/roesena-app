import { ObjectID } from "mongodb";

import { Event } from "../interfaces"
import { ConnectionProvider } from "../connection";

export async function eventsByDate({ startDate, endDate }: { startDate: number, endDate: number }): Promise<Event[]> {
  const collection = (await ConnectionProvider.Instance.db).collection("events");
  return await collection.find({
    $and: [
      { startDate: { $lte: endDate } },
      { endDate: { $gte: startDate } }
    ]
  }).toArray();
}

export async function events(): Promise<Event[]> {
  const collection = (await ConnectionProvider.Instance.db).collection("events");
  return await collection.find({}).toArray();
}
