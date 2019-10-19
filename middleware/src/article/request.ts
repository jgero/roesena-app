import { ObjectID } from "mongodb";

import { Article } from "../interfaces"
import { ConnectionProvider } from "../connection";

export async function articles(): Promise<Article[]> {
  const collection = (await ConnectionProvider.Instance.db).collection("articles");
  return await collection.find({}).toArray();
}

export async function article({ _id }: { _id: string }): Promise<Article | null> {
  const collection = (await ConnectionProvider.Instance.db).collection("persons");
  return await collection.findOne<Article>({ _id: new ObjectID(_id) });
}
