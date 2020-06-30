import * as express from 'express';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// middleware to check if all needed request data is present
const checkRequestData: express.RequestHandler = (req, res, next) => {
  if (!req.body.data || !req.body.data.id) {
    res.status(400).send({ error: 'invalid request body' });
    return;
  }
  next();
};

const validateFirebaseIdToken: express.RequestHandler = async (req, res, next) => {
  // no session cookie or bearer token found
  if (
    (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
    !(req.cookies && req.cookies.__session)
  ) {
    res.status(403).send({ error: 'Unauthorized' });
    return;
  }

  let idToken: string;
  // check for auth header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
    // check for session cookie
  } else if (req.cookies) {
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie or header
    res.status(403).send({ error: 'Unauthorized' });
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    // append uid to request and pass to next middleware
    (req as any).uid = decodedIdToken.uid;
    next();
    return;
  } catch (error) {
    // could not verify id token
    res.status(403).send({ error: 'Unauthorized' });
    return;
  }
};

// check if user is authenticated and allowed to change the marker
const checkInvitationStatus: express.RequestHandler = async (req, res, next) => {
  // get the event and append it to the request object
  const doc = (await admin.firestore().collection('events').doc(req.body.data.id).get()).data();
  // check if event exists
  if (!doc) {
    res.status(400).send({ error: 'invalid request id' });
    return;
  }
  // check if person is not invited to event (uid is set in token validation middlware)
  const part = doc.participants[(req as any).uid];
  if (!part) {
    res.status(400).send({ error: 'person is not invited to event' });
    return;
  }
  // if person has no unseen changes
  if (!part.hasUnseenChanges) {
    res.status(200).send({ data: 'person has no unseen changes' });
    return;
  }
  // next only has to be called if nothing happens
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
  // update the document with updated marker
  try {
    await admin
      .firestore()
      .collection('events')
      .doc(req.body.data.id)
      .update({ [`participants.${(req as any).uid}.hasUnseenChanges`]: false });
  } catch (error) {
    res.status(500).send({ error: 'failed to update event' });
    return;
  }
  res.send({ data: `event ${req.body.data.id} marked as seen for user ${(req as any).uid}` });
});

// export express app as cloud function
export const changeSeenMarker = functions.region('europe-west1').https.onRequest(app);
