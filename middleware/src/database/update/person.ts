import { ObjectID } from 'bson';

import { ConnectionProvider } from '../connection';
import { Person } from '../../interfaces';

export async function createPerson(newPerson: Person, auth: number): Promise<Person | null> {
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  // only presidency or admins can create persons
  // you can only create users with lower auth level than your own
  if (auth > 3 && auth > newPerson.authorityLevel) {
    const result = await collection.insertOne(newPerson);
    // the result.ops[0] contains the data that was inserted by the query
    if (result.insertedCount > 0) {
      return result.ops[0] as Person;
    }
  }
  return null;
}

export async function updatePerson(personToUpdate: Person, auth: number): Promise<Person | null> {
  const { _id, name, authorityLevel } = personToUpdate;
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  // only presidency or admins can update persons
  // new auth level cannot be the same or higher as own
  if (auth > 3 && auth > authorityLevel) {
    const result = await collection.findOneAndUpdate(
      // only update if auth of person to update is lower than the own auth level
      { _id: new ObjectID(_id), authorityLevel: { $lt: auth } },
      // update name and authorrityLevel
      { $set: { name, authorityLevel } },
      { returnOriginal: false }
    );
    return result.value;
  }
  return null;
}

export async function deletePerson(personId: string, auth: number): Promise<boolean> {
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  // only presidency or admins can delete persons and only persons with lower auth level
  if (auth > 3) {
    const result = await collection.deleteOne({ _id: new ObjectID(personId), authorityLevel: { $lt: auth } });
    return result.deletedCount === 1;
  }
  return false;
}
