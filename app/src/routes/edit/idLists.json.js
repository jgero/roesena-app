import { getDB } from '../../dbConnection.js';

export async function get(req, res) {
  const events = await getDB()
    .collection('events')
    .find({})
    .project({ _id: 1, title: 1 })
    .toArray();
  const result = {
    events: [...events],
    groups: [ { _id: "asdfasdf", name: "Sechtafeger" }, { _id: "asdfasdf", name: "Das Wilde Heer" } ],
    articles: [ { _id: "asdfasdf", title: "Narrengericht" } ],
    images: [ { _id: "asdfasdf", title: "1.Garde auf der Punksitzung" } ],
    persons: [ { _id: "asdfasdf", name: "Taylor Swift" } ]
  }
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify(result));
}
