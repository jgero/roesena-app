import { MongoClient } from 'mongodb';

const URL = 'mongodb://mongodb:27017';
let _db;

export function initDB(callback) {
  if (_db) {
    console.warn('DB was already initialized!');
    return callback(_db);
  } else {
    MongoClient(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 10
    })
      .connect()
      .then(connection => {
        _db = connection.db('roesena');
        callback(_db);
      });
  }
}

export function getDB() {
  return _db;
}
