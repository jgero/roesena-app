import { ObjectID } from "bson";

import { ConnectionProvider } from "../connection";
import { Person } from "../interfaces";

export async function deletePerson({ _id }: { _id: string }, context: any): Promise<boolean> {
  const collection = (await ConnectionProvider.Instance.db).collection("persons");
  const authLevel: number = (await context).authLevel;
  const beforeUpdate = await collection.findOne<Person>({ _id: new ObjectID(_id) });
  // only presidency or admins can delete persons and only persons with lower auth level
  if (authLevel > 3 && (beforeUpdate && (beforeUpdate.authorityLevel < authLevel))) {
    const result = await collection.deleteOne({ _id: new ObjectID(_id) });
    return result.deletedCount === 1;
  }
  return false;
}