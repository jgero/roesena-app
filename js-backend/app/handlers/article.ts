import { Request, Response } from "express";
import { getClient } from "../clientProvider";
import { MongoClient, ObjectID } from "mongodb";

export function getArticle(req: Request, res: Response) {
  if (!req.query.id) {
    res.status(400).send({ error: 'query param id is missing' });
    return;
  }
  const filter = req.query.id === '*' ? {} : { _id: new ObjectID(req.query.id) };
  getClient().subscribe({
    next: (client: MongoClient) => {
      client.db('roesena').collection('articles').find(filter).toArray()
        .then(result => {
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

export function updateArticle(req: Request, res: Response) {
  if (!req.query.id) {
    res.status(400).send({ error: 'query param id is missing' });
    return;
  }
  getClient().subscribe({
    next: (client: MongoClient) => {
      client.db('roesena').collection('articles').replaceOne({ _id: new ObjectID(req.query.id) }, req.body)
        .then(() => {
          res.status(200).send({ status: 'article updated' });
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

export function addArticle(req: Request, res: Response) {
  getClient().subscribe({
    next: (client: MongoClient) => {
      client.db('roesena').collection('articles').insertOne(req.body)
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

export function deleteArticle(req: Request, res: Response) {
  if (!req.query.id) {
    res.status(400).send({ error: 'query param id is missing' });
    return;
  }
  getClient().subscribe({
    next: (client: MongoClient) => {
      client.db('roesena').collection('articles').deleteOne({ _id: new ObjectID(req.query.id) })
        .then(() => {
          res.status(200).send({ status: 'article deleted' });
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