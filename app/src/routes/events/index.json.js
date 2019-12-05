import { getDB } from '../../dbConnection.js';

export function get(req, res) {
  const result = getDB()
    .collection('events')
    .find()
    .toArray();
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify(result));
}
