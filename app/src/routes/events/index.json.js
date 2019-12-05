import { getDB } from '../../dbConnection.js';

export async function get(req, res) {
  const result = await getDB()
    .collection('events')
    .find()
    .toArray();
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify(result));
}

export async function post(req, res) {
  const { title, description, start_date, end_date, auth_lvl } = req.body;
  const response = await getDB()
    .collection('events')
    .insertOne({
      title,
      description,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      auth_lvl
    });
  console.log(response.insertedCount);
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify({ message: 'done' }));
}
