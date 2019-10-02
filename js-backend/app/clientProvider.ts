import { MongoClient } from 'mongodb';
import { Observable } from 'rxjs';

export function getClient() {
  return new Observable<MongoClient>((observer) => {
    const url = 'mongodb://mongo:27017';
    // Create a new MongoClient
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    // connect to the database
    client.connect((err) => {
      if (err) {
        observer.error(err);
      } else {
        observer.next(client);
        observer.complete();
      }
    });
  })
}