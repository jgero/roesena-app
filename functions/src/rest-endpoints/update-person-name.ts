import * as express from 'express';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { validateFirebaseIdToken } from '../utils/validate-firebase-token-middleware';

const app = express();
// allow cross-origin requests (currently only needed for testing in emulator)
app.use(cors({ origin: true }));
app.use(cookieParser());

app.use(validateFirebaseIdToken);

app.post('/:id', async (req, res) => {
  // get the person doc
  const doc = (
    await admin
      .firestore()
      .collection('persons')
      .doc((req as any).uid)
      .get()
  ).data();
  // check if person exists
  if (!doc) {
    res.status(400).send({ error: 'no person document found for current user' });
    return;
  }
  // check if user is in 'admin' group or current user changes his own name
  if (!doc.groups.admin && (req as any).uid !== req.params.id) {
    res.status(403).send({ error: 'current user is not admin or changing own name' });
    return;
  }
  // check for id
  if (!req.params.id) {
    res.status(400).send({ error: 'no person target id' });
    return;
  }
  // check for new name
  if (!req.body.data && req.body.data.name) {
    res.status(400).send({ error: 'no new name was provided' });
    return;
  }
  // update user with provided name
  try {
    await admin.firestore().collection('persons').doc(req.params.id).update({ name: req.body.data.name });
  } catch (error) {
    res.status(500).send({ error: 'failed to update person' });
    return;
  }
  res.send({ data: `changed name of person ${req.params.id} to ${req.body.data.name}` });
});

// export express app as cloud function
export const updatePersonName = functions.region('europe-west1').https.onRequest(app);
