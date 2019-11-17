import { MongoClient, Db } from "mongodb";

export class ConnectionProvider {

  private URL = 'mongodb://mongo:27017';

  private static instance: ConnectionProvider;
  private database: Db;

  public static get Instance(): ConnectionProvider {
    if (!ConnectionProvider.instance) {
      // create the static instance if none is there already
      this.instance = new this();
    }
    return this.instance;
  }

  public get db(): Promise<Db> {
    return new Promise((resolve, reject) => {
      if (this.database) {
        resolve(this.database);
      } else {
        console.log("new connection!");
        new MongoClient(this.URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          poolSize: 10
        }).connect().then(
          res => {
            this.database = res.db("roesena");
            resolve(this.database);
          },
          err => reject(err)
        );
      }
    });
  }
}
