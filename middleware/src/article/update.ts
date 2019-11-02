import { ObjectID } from "mongodb";

import { Article } from "../interfaces"
import { ConnectionProvider } from "../connection";

export async function updateArticle(
  args: { input: { _id: string, date: number, title: string, content: string, images: string[] } }
): Promise<Article> {
  const { _id, date, title, content, images } = args.input;
  const collection = (await ConnectionProvider.Instance.db).collection("articles");
  return new Promise((resolve) => {
    collection.findOneAndUpdate({ _id: new ObjectID(_id) }, { $set: { date, title, content, images } }).then(res => {
      resolve(res.value as Article);
    });
  });
}

export async function newArticle(
  args: { input: { date: number, title: string, content: string, images: string[] } }
): Promise<Article> {
  const { date, title, content, images } = args.input;
  const collection = (await ConnectionProvider.Instance.db).collection("persons");
  return new Promise((resolve) => {
    collection.insertOne({ date, title, content, images }).then(res => {
      resolve(res.ops[0] as Article);
    });
  });
}
