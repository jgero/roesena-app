import { ObjectID } from "mongodb";

import { ConnectionProvider } from "../connection";

export async function deleteArticle({ _id }: { _id: string }): Promise<boolean> {
  const collection = (await ConnectionProvider.Instance.db).collection("articles");
  return new Promise((resolve) => {
    collection.deleteOne({ _id: new ObjectID(_id) }).then(res => {
      resolve(res.deletedCount == 1);
    })
  });
}
