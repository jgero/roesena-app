import { ObjectID } from "bson";

import { Person } from "../interfaces";
import { ConnectionProvider } from "../connection";

export async function persons({ name }: { name: string }, context: any) {
  const auth = (await context).authLevel;
  // user has to be logged in to get person data
  if (auth > 1) {
    const collection = (await ConnectionProvider.Instance.db).collection("persons");
    if (name) {
      return await collection.find({ name: name }).toArray();
    } else {
      return await collection.find({}).toArray();
    }
  } else {
    return [];
  }
}

export async function person({ _id }: { _id: string }, context: any): Promise<Person | null> {
  const auth = (await context).authLevel;
  // user has to be logged in to get person data
  if (auth > 1 && _id) {
    const collection = (await ConnectionProvider.Instance.db).collection("persons");
    return await collection.findOne<Person>({ _id: new ObjectID(_id) });
  } else {
    return null;
  }
}
