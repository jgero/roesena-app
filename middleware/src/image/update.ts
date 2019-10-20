import { ObjectID } from "mongodb";

import { Image } from "../interfaces"
import { ConnectionProvider } from "../connection";

export async function newImage(
  { description, image, tags }: {
    description: string, image: string, tags: string[]
  }): Promise<Image> {
  const collection = (await ConnectionProvider.Instance.db).collection("images");
  return new Promise((resolve) => {
    collection.insertOne({ description, image, tags }).then(result => {
      // the result.ops[0] contains the data that was inserted by the query
      resolve(result.ops[0] as Image);
    })
  });
}

export async function updateImage(
  { _id, description, image, tags }: { _id: string, description: string, image: string, tags: string[] }
): Promise<Image> {
  const collection = (await ConnectionProvider.Instance.db).collection("images");
  return new Promise((resolve) => {
    collection.replaceOne({ _id: new ObjectID(_id) }, { description, image, tags }).then(result => {
      resolve(result.ops[0] as Image);
    });
  });
}
