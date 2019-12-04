import { getDB } from '../../dbConnection.js';

export function get(req, res) {
  const result = getDB()
    .collection('test')
    .find();
  console.log(result);
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify({ message: 'test' }));
}
