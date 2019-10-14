import { Person } from "../interfaces";
import { Database } from "../connection";
import { ObjectID } from "bson";

export class PersonResolver extends Database {

  public async persons({ name }: { name: string }, context: any) {
    const auth = (await context).authLevel;
    // user has to be logged in to get person data
    if (auth > 1) {
      const collection = (await Database.db).collection("persons");
      if (name) {
        return await collection.find({ name: name }).toArray();
      } else {
        return await collection.find({}).toArray();
      }
    } else {
      return [];
    }
  }

  public async person({ _id }: { _id: string }, context: any): Promise<Person | null> {
    const auth = (await context).authLevel;
    // user has to be logged in to get person data
    if (auth > 1 && _id) {
      const collection = (await Database.db).collection("persons");
      return await collection.findOne<Person>({ _id: new ObjectID(_id) });
    } else {
      return null;
    }
  }

}