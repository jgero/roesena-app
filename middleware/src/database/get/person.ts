import { ObjectID } from 'bson';

import { ConnectionProvider } from '../connection';
import { Person } from '../../interfaces';

export async function getAllPersons(auth: number): Promise<Person[]> {
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  // only members can see persons
  if (auth > 1) {
    return await collection
      .find({})
      // only return _id, name and authorityLevel (no password)
      .project({ name: 1, authorityLevel: 1 })
      .toArray();
  } else {
    return [];
  }
}

export async function getPersonById(personId: string, auth: number): Promise<Person | null> {
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  // only members can see persons
  if (auth > 1) {
    // only return _id, name and authorityLevel (no password)
    return await collection.findOne<Person>({ _id: new ObjectID(personId) }, { projection: { name: 1, authorityLevel: 1 } });
  } else {
    return null;
  }
}
