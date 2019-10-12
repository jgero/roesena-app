import { Person } from "../interfaces";
import { Database } from "../connection";

export class PersonResolver extends Database {

  public persons(): Promise<Person[]> {
    return new Promise((resolve, reject) => {
      Database.connection
        .then(
          connection => {
            const collection = connection.db("roesena").collection("persons");
            collection.find({}).toArray()
              .then(result => resolve(result))
              .catch(reason => reject(reason))
          },
          reason => reject(reason)
        );
    });
  }

  public person(args: any): Promise<Person | undefined> {
    return new Promise((resolve, reject) => {
      resolve([
        { _id: "asdf", name: "Bob", authorityLevel: 4 }, { _id: "jklö", name: "Mary", authorityLevel: 2 }
      ].find(el => el._id === args._id));
    });
  }

}