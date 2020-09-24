import * as express from 'express';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { validateFirebaseIdToken } from '../utils/validate-firebase-token-middleware';

// middleware to check if all needed request data is present
const checkRequestData: express.RequestHandler = (req, res, next) => {
  if (
    !req.body.data ||
    !req.body.data.id ||
    req.body.data.amount === undefined ||
    req.body.data.amount === null ||
    req.body.data.amount < 0
  ) {
    res.status(400).send({ error: 'request data is missing id or amount' });
    return;
  }
  next();
};

// check if user is authenticated and allowed to change the marker
const checkInvitationStatus: express.RequestHandler = async (req, res, next) => {
  // get event document
  const doc = (await admin.firestore().collection('events').doc(req.body.data.id).get()).data();
  // check if event exists
  if (!doc) {
    res.status(400).send({ error: 'invalid request id' });
    return;
  }
  // check if event has a deadline (if not it can't have participants)
  if (!doc.deadline) {
    res.status(400).send({ error: 'event does not have a deadline' });
    return;
  }
  // check if deadline is already over
  if (new Date(doc.deadline.toDate()).getTime() < new Date().getTime()) {
    res.status(400).send({ error: 'dedline already over' });
    return;
  }
  // check if person is not invited to event
  if (!doc.participants[(req as any).uid]) {
    res.status(400).send('person is not invited to event');
    return;
  }
  next();
};

const app = express();
// allow cross-origin requests (currently only needed for testing in emulator)
app.use(cors({ origin: true }));
app.use(cookieParser());

app.use(checkRequestData);
app.use(validateFirebaseIdToken);
app.use(checkInvitationStatus);

app.post('/', async (req, res) => {
  // update the document with updated amount
  try {
    await admin
      .firestore()
      .collection('events')
      .doc(req.body.data.id)
      .update({ [`participants.${(req as any).uid}.amount`]: req.body.data.amount });
  } catch (error) {
    res.status(500).send({ error: 'failed to update event' });
    return;
  }
  res
    .status(200)
    .send({ data: `amount for participant ${(req as any).uid} in event ${req.body.data.id} set to ${req.body.data.amount}` });
});

// export express app as cloud function
export const respondToEvent = functions.region('europe-west1').https.onRequest(app);
