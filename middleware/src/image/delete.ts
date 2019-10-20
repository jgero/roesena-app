import { ObjectID } from "bson";

import { ConnectionProvider } from "../connection";

export async function deleteImage({ _id }: { _id: string }): Promise<boolean> {
  const collection = (await ConnectionProvider.Instance.db).collection("images");
  return new Promise((resolve) => {
    collection.deleteOne({ _id: new ObjectID(_id) }).then(result => {
      resolve(result.deletedCount === 1);
    });
  });
}