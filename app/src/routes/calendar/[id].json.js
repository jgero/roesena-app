import { getDB } from '../../dbConnection.js';

export async function get(req, res) {
  // this endpoint will return the events that are in the month following the passed date
  const reqStartDate = new Date(req.params.id);
  // set the end date to one month after the passed day
  const reqEndDate = new Date(reqStartDate.getFullYear(), reqStartDate.getMonth() + 1, reqStartDate.getDate());
  const result = await getDB()
    .collection('events')
      .find({
        $and: [
          { start_date: { $lte: reqEndDate } },
          { end_date: { $gte: reqStartDate } }
        ]
      })
    .toArray();
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify(result));
}
