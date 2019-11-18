import { ObjectID } from 'bson';

import { ConnectionProvider } from '../connection';
import { Image } from '../../interfaces';

export async function getImageById(id: string): Promise<Image | null> {
  const collection = (await ConnectionProvider.Instance.db).collection('images');
  return await collection.findOne<Image>({ _id: new ObjectID(id) });
}

export async function getAllImages(): Promise<Image[]> {
  const collection = (await ConnectionProvider.Instance.db).collection('images');
  return await collection.find<Image>({}).toArray();
}
