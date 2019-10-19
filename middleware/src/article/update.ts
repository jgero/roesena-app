import { ObjectID } from "mongodb";

import { Article } from "../interfaces"
import { ConnectionProvider } from "../connection";

export async function updateArticle(
  { _id, date, title, content, images }: { _id: string, date: number, title: string, content: string, images: string[] }
): Promise<Article> {
  const collection = (await ConnectionProvider.Instance.db).collection("articles");
  return new Promise((resolve) => {
    collection.replaceOne({ _id: new ObjectID(_id) }, { date, title, content, images }).then(res => {
      resolve(res.ops[0] as Article);
    });
  });
}

export async function newArticle(
  { date, title, content, images }: { date: number, title: string, content: string, images: string[] }
): Promise<Article> {
  const collection = (await ConnectionProvider.Instance.db).collection("persons");
  return new Promise((resolve) => {
    collection.insertOne({ date, title, content, images }).then(res => {
      resolve(res.ops[0] as Article);
    });
  });
}
