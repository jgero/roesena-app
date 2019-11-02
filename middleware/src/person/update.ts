import { ObjectID } from "mongodb";

import { Person } from "../interfaces"
import { ConnectionProvider } from "../connection";

export async function newPerson(
  args: { input: { name: string, authorityLevel: number } },
  context: any
): Promise<Person | null> {
  const { name, authorityLevel } = args.input;
  const collection = (await ConnectionProvider.Instance.db).collection("persons");
  const authLevel: number = (await context).authLevel;
  // only presidency or admins can create persons
  // you can only create users with lower auth level than your own
  if ((authLevel > 3) && (authLevel > authorityLevel)) {
    const result = await collection.insertOne({ name, authorityLevel });
    // the result.ops[0] contains the data that was inserted by the query
    return result.ops[0] as Person;
  }
  return null;
}

export async function updatePerson(
  args: { input: Person },
  context: any
): Promise<Person | null> {
  const { _id, name, authorityLevel } = args.input;
  const collection = (await ConnectionProvider.Instance.db).collection("persons");
  const authLevel: number = (await context).authLevel;
  const beforeUpdate = await collection.findOne<Person>({ _id: new ObjectID(_id) });
  // only presidency or admins can update persons
  // you can only update users with lower auth level
  if ((authLevel > 3) && (authorityLevel < authLevel) && (beforeUpdate && (authLevel > beforeUpdate.authorityLevel))) {
    const result = await collection.findOneAndUpdate({ _id: new ObjectID(_id) }, { $set: { name, authorityLevel } });
    // the result.ops[0] contains the data that was inserted by the query
    return result.value as Person;
  }
  return null;
}
