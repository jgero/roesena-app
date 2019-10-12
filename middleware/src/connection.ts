import { MongoClient } from "mongodb";

const URL = 'mongodb://mongo:27017';

export class Database {

  public static connection =
    new MongoClient(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 10
    }).connect();

}