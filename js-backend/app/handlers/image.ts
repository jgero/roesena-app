import { Request, Response } from "express";
import { getClient } from "../clientProvider";
import { MongoClient, ObjectID, ObjectId } from "mongodb";

export function getImage(req: Request, res: Response) {
  // when id query param exists it has to be * or a valid mongo object id
  if (!(req.query.id && (req.query.id === '*' || ObjectId.isValid(req.query.id)))) {
    res.status(400).send({ error: 'query param id is missing or no valid id' });
    return;
  }
  getClient().subscribe({
    next: (client: MongoClient) => {
      let query: Promise<any>;
      if (req.query.id === '*') {
        query = client.db('roesena').collection('images').find({}, { projection: { _id: 1, description: 1, tags: 1 } }).toArray();
      } else {
        query = client.db('roesena').collection('images').find({ _id: new ObjectID(req.query.id) }).toArray();
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

export function updateImage(req: Request, res: Response) {
  if (!req.query.id) {
    res.status(400).send({ error: 'query param id is missing' });
    return;
  }
  getClient().subscribe({
    next: (client: MongoClient) => {
      client.db('roesena').collection('images').replaceOne({ _id: new ObjectID(req.query.id) }, req.body)
        .then(() => {
          res.status(200).send({ status: 'image updated' });
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

export function addImage(req: Request, res: Response) {
  getClient().subscribe({
    next: (client: MongoClient) => {
      client.db('roesena').collection('images').insertOne(req.body)
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

export function deleteImage(req: Request, res: Response) {
  if (!req.query.id) {
    res.status(400).send({ error: 'query param id is missing' });
    return;
  }
  getClient().subscribe({
    next: (client: MongoClient) => {
      client.db('roesena').collection('images').deleteOne({ _id: new ObjectID(req.query.id) })
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