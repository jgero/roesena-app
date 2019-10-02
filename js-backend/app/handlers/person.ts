import { Request, Response } from "express";
import { getClient } from "../clientProvider";
import { MongoClient, ObjectID } from "mongodb";

const pubProjection = { _id: 1, name: 1, authorityLevel: 1 };

export function getPerson(req: Request, res: Response) {
  if (!req.query.id) {
    res.status(400).send({ error: 'query param id is missing' });
    return;
  }
  getClient().subscribe({
    next: (client: MongoClient) => {
      const collection = client.db('roesena').collection('persons');
      const filter = req.query.id === '*' ? {} : { _id: new ObjectID(req.query.id) };
      collection.find(filter, { projection: pubProjection }).toArray()
        .then((result) => {
          res.status(200).send(result);
          client.close();
        })
        .catch((err) => {
          res.status(500).send({ error: err });
          client.close();
        })
    },
    error: err => res.status(500).send({ error: err })
  });
}

export function updatePerson(req: Request, res: Response) {
  if (!req.query.id) {
    res.status(400).send({ error: 'query param id is missing' });
    return;
  }
  getClient().subscribe({
    next: (client: MongoClient) => {
      client.db('roesena').collection('persons').replaceOne({ _id: new ObjectID(req.query.id) }, req.body)
        .then(() => {
          res.status(200).send({ status: 'person updated' });
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

export function addPerson(req: Request, res: Response) {
  getClient().subscribe({
    next: (client: MongoClient) => {
      client.db('roesena').collection('persons').insertOne(req.body)
        .then(() => {
          res.status(200).send({ status: 'person inserted' });
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

export function deletePerson(req: Request, res: Response) {
  if (!req.query.id) {
    res.status(400).send({ error: 'query param id is missing' });
    return;
  }
  getClient().subscribe({
    next: (client: MongoClient) => {
      client.db('roesena').collection('persons').deleteOne({ _id: new ObjectID(req.query.id) })
        .then(() => {
          res.status(200).send({ status: 'person deleted' });
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