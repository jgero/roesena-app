import { ObjectID } from "mongodb";

import { Image } from "../interfaces"
import { Database } from "../connection";

export class ImageResolver extends Database {

  public async images(): Promise<Image[]> {
    const collection = (await Database.db).collection("images");
    return await collection.find({}).toArray();
  }

  public async image({ _id }: { _id: string }): Promise<Image | null> {
    const collection = (await Database.db).collection("images");
    return await collection.findOne<Image>({ _id: new ObjectID(_id) });
  }

}
