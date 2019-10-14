import { MongoClient, Db } from "mongodb";

const URL = 'mongodb://mongo:27017';

export class Database {

  public static get db(): Promise<Db> {
    return new Promise((resolve, reject) => {
      Database.connection.then(
        res => resolve(res.db("roesena")),
        () => reject("could not connect to db")
      );
    });
  }

  private static connection = new MongoClient(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  }).connect();

}