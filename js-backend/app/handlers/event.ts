import { Request, Response } from "express";
import { getClient } from "../clientProvider";
import { MongoClient, ObjectID } from "mongodb";

export function getEvent(req: Request, res: Response) {
  if (!(req.query.id || (req.query.start && req.query.end))) {
    res.status(400).send({ error: 'query param id is missing' });
    return;
  }
  getClient().subscribe({
    next: (client: MongoClient) => {
      let query: Promise<any>;
      if (req.query.id) {
        // if an id is provided
        if (req.query.id === '*') {
          query = client.db('roesena').collection('events').find({}).toArray();
        } else {
          query = client.db('roesena').collection('events').find({ _id: new ObjectID(req.query.id) }).toArray();
        }
      } else {
        // if a start and end is provided
        query = client.db('roesena').collection('events').find(
          {
            $and: [
              { startDate: { $lte: parseInt(req.query.end) } },
              { endDate: { $gte: parseInt(req.query.start) } }
            ]
          }).toArray();
      }
      query.then(result => {
        res.status(200).send(result);
        client.close();
        return;
      })
        .catch(err => {
          res.status(500).send({ error: err });
          client.close();
          return;
        });
    },
    error: err => res.status(500).send({ error: err })
  });
}

export function updateEvent(req: Request, res: Response) {
  if (!req.query.id) {
    res.status(400).send({ error: 'query param id is missing' });
    return;
  }
  getClient().subscribe({
    next: (client: MongoClient) => {
      client.db('roesena').collection('events').replaceOne({ _id: new ObjectID(req.query.id) }, req.body)
        .then(() => {
          res.status(200).send({ status: 'event updated' });
          client.close();
          return;
        })
        .catch(err => {
          res.status(500).send({ error: err });
          client.close();
          return;
        });
    },
    error: err => res.status(500).send({ error: err })
  });
}

export function addEvent(req: Request, res: Response) {
  getClient().subscribe({
    next: (client: MongoClient) => {
      client.db('roesena').collection('events').insertOne(req.body)
        .then((result) => {
          res.status(200).send({ _id: result.insertedId });
          client.close();
          return;
        })
        .catch(err => {
          res.status(500).send({ error: err });
          client.close();
          return;
        });
    },
    error: err => res.status(500).send({ error: err })
  });
}

export function deleteEvent(req: Request, res: Response) {
  if (!req.query.id) {
    res.status(400).send({ error: 'query param id is missing' });
    return;
  }
  getClient().subscribe({
    next: (client: MongoClient) => {
      client.db('roesena').collection('events').deleteOne({ _id: new ObjectID(req.query.id) })
        .then(() => {
          res.status(200).send({ status: 'image deleted' });
          client.close();
          return;
        })
        .catch(err => {
          res.status(500).send({ error: err });
          client.close();
          return;
        });
    },
    error: err => res.status(500).send({ error: err })
  });
}