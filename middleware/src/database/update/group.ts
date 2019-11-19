import { ObjectID } from 'bson';

import { Group } from '../../interfaces';
import { ConnectionProvider } from '../connection';

export async function createGroup(newGroup: Group, auth: number): Promise<Group | null> {
  const collection = (await ConnectionProvider.Instance.db).collection('groups');
  // only presidency and above can create groups
  if (auth > 3) {
    const result = await collection.insertOne(newGroup);
    // the result.ops[0] contains the data that was inserted by the query
    return result.ops[0] as Group;
  }
  return null;
}

export async function updateGroup(groupToUpdate: Group, auth: number): Promise<Group | null> {
  const collection = (await ConnectionProvider.Instance.db).collection('groups');
  const { _id, name, members } = groupToUpdate;
  // only group leaders and above can edit groups
  if (auth > 2) {
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectID(_id) },
      // update the group
      { $set: { name, members } },
      { returnOriginal: false }
    );
    return result.value;
  }
  return null;
}

export async function deleteGroup(groupId: string, auth: number): Promise<boolean> {
  const collection = (await ConnectionProvider.Instance.db).collection('groups');
  // only presidency and above can delete images
  if (auth > 2) {
    const result = await collection.deleteOne({ _id: new ObjectID(groupId) });
    return result.deletedCount === 1;
  }
  return false;
}
