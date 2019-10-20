import { ObjectID } from "mongodb";

import { Event } from "../interfaces"
import { ConnectionProvider } from "../connection";

export async function events({ startDate, endDate }: { startDate: number, endDate: number }): Promise<Event[]> {
  const collection = (await ConnectionProvider.Instance.db).collection("events");
  return await collection.find({
    $and: [
      { startDate: { $lte: endDate } },
      { endDate: { $gte: startDate } }
    ]
  }).toArray();
}
