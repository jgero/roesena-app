import { getDB } from '../dbConnection.js';

export async function get(req, res) {
  const result = await getDB()
    .collection('events')
    .find({ start_date: { $gte: new Date() } })
    .sort({ start_date: 1 })
    .toArray();
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify(result));
}
