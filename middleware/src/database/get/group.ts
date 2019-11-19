import { ObjectID } from 'bson';

import { ConnectionProvider } from '../connection';
import { Group } from '../../interfaces';

export async function getAllGroups(): Promise<Group[]> {
  const collection = (await ConnectionProvider.Instance.db).collection('groups');
  return await collection.find({}).toArray();
}

export async function getGroupById(groupId: string): Promise<Group | null> {
  const collection = (await ConnectionProvider.Instance.db).collection('groups');
  return await collection.findOne({ _id: new ObjectID(groupId) });
}
