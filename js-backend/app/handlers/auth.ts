import { Request, Response } from "express";
import { getClient } from "../clientProvider";
import { MongoClient, ObjectID } from "mongodb";
import { compare, hash } from "bcrypt";
import { randomBytes } from "crypto";

export function login(req: Request, res: Response) {
  if (!(req.body && req.body.username && req.body.password)) {
    res.status(400).send({ error: 'username or password are missing in the request body' });
  }
  getClient().subscribe({
    next: (client: MongoClient) => {
      checkPw(req.body.username, req.body.password, client)
        .then(isPwCorrect => {
          if (isPwCorrect) {
            // generate sessionId
            const session = randomBytes(16).toString('base64');
            const collection = client.db('roesena').collection('persons');
            // update sessionId in db
            collection.updateOne({ name: req.body.username }, { $set: { sessionId: session } })
              .then(updateRes => {
                if (updateRes.modifiedCount == 1) {
                  // set cookie
                  res.cookie('session_token', session);
                  // get person from db
                  collection.findOne({ name: req.body.username }, { projection: { _id: 1, name: 1, authorityLevel: 1 } })
                    .then(result => {
                      res.status(200).send(result);
                      client.close();
                    })
                    .catch(err => {
                      res.status(500).send({ error: err });
                      client.close();
                    });
                } else {
                  res.status(500).send({ error: 'could not set sessionId in db' });
                  client.close();
                }
              })
              .catch(err => {
                res.status(500).send({ error: err });
                client.close();
              })
          } else {
            res.status(401).send({ error: 'password is not correct' });
            client.close();
          }
        })
        .catch(err => {
          res.status(500).send({ error: err });
          client.close();
        });
    },
    error: (err) => res.status(500).send({ error: err })
  });
}

function checkPw(username: string, password: string, client: MongoClient): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const collection = client.db('roesena').collection('persons');
    collection.find({ name: username }).toArray()
      .then((result) => {
        if (result.length > 0) {
          compare(password, result[0].password)
            .then(pwCheck => resolve(pwCheck))
            .catch(err => reject(err));
        } else {
          resolve(false)
        }
      })
      .catch(err => reject(err));
  });
}

export function logout(req: Request, res: Response) {
  getClient().subscribe({
    next: (client: MongoClient) => {
      res.cookie('session_token', '', { maxAge: -1 });
      const collection = client.db('roesena').collection('persons');
      collection.updateOne({ name: req.params.username }, { $unset: { sessionId: '' } })
        .then(updateRes => {
          if (updateRes.modifiedCount == 1) {
            res.status(200).send({ status: 'session closed' });
            client.close();
          } else {
            res.status(500).send({ error: `${updateRes.modifiedCount} items were modified` });
            client.close();
          }
        })
        .catch(err => {
          res.status(500).send({ error: err })
          client.close();
        })
    },
    error: (err) => res.status(500).send({ error: err })
  })
}

export function restoreSession(req: Request, res: Response) {
  if (!req.cookies.session_token) {
    res.status(401).send({ error: 'no cookie left' });
    return;
  }
  getClient().subscribe({
    next: (client: MongoClient) => {
      const collection = client.db('roesena').collection('persons');
      collection.findOne({ sessionId: req.cookies.session_token })
        .then(result => {
          if (result) {
            delete result.password;
            delete result.sessionId;
            res.status(200).send(result);
            client.close();
          } else {
            res.cookie('session_token', '', { maxAge: -1 });
            res.status(401).send({ error: 'session id is no longer valid' });
            client.close();
          }
        })
        .catch(err => {
          res.cookie('session_token', '', { maxAge: -1 });
          res.status(500).send({ error: err });
          client.close();
        });
    },
    error: (err) => {
      res.cookie('session_token', '', { maxAge: -1 });
      res.status(500).send({ error: err });
    }
  });
}

export function changePassword(req: Request, res: Response) {
  if (!(req.body && req.body._id && req.body.password)) {
    res.status(500).send({ error: 'request body missing _id or password' });
    return;
  }
  hash(req.body.password, 10)
    .then(pwHash => {
      getClient().subscribe({
        next: (client: MongoClient) => {
          const collection = client.db('roesena').collection('persons');
          if (req.cookies.session_token) {
            collection.findOne({ sessionId: req.cookies.session_token })
              .then(actingUser => {
                // you can only change the pw if it's your own or you are an admin
                if (actingUser._id === req.body._id || actingUser.authorityLevel == 5) {
                  console.log(req.body._id);
                  collection.updateOne({ _id: new ObjectID(req.body._id) }, { $set: { password: pwHash } })
                    .then((updateRes) => {
                      res.status(200).send({ status: 'password reset' });
                      client.close();
                      return;
                    })
                    .catch((err) => {
                      res.status(500).send({ error: err });
                      client.close();
                      return;
                    });
                } else {
                  res.status(401).send({ error: 'you do not have permission to change this password' });
                  client.close();
                  return;
                }
              })
              .catch(err => {
                res.status(500).send({ error: err });
                client.close();
              });
          } else {
            res.status(401).send({ error: 'not logged in' });
            client.close();
            return;
          }
        },
        error: (err) => res.status(500).send({ error: err })
      })
    })
    .catch(err => res.status(500).send({ error: err }));
}