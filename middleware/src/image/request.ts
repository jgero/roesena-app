import { ObjectID } from "mongodb";

import { Image } from "../interfaces"
import { ConnectionProvider } from "../connection";

export async function images(): Promise<Image[]> {
  const collection = (await ConnectionProvider.Instance.db).collection("images");
  return await collection.find({}).toArray();
}

export async function image({ _id }: { _id: string }): Promise<Image | null> {
  const collection = (await ConnectionProvider.Instance.db).collection("images");
  return await collection.findOne<Image>({ _id: new ObjectID(_id) });
}
