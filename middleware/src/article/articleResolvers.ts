import { ObjectID } from "mongodb";

import { Article } from "../interfaces"
import { Database } from "../connection";

export class ArticleResolver extends Database {

  public async articles(): Promise<Article[]> {
    const collection = (await Database.db).collection("articles");
    return await collection.find({}).toArray();
  }

  public async article({ _id }: { _id: string }, context: any): Promise<Article | null> {
    const collection = (await Database.db).collection("persons");
    return await collection.findOne<Article>({ _id: new ObjectID(_id) });
  }

}
