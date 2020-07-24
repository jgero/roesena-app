import * as express from 'express';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { validateFirebaseIdToken } from '../utils/validate-firebase-token-middleware';

// check if user is admin
const checkAdminGroup: express.RequestHandler = async (req, res, next) => {
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
  // check if user is in 'admin' group
  if (!doc.groups.admin) {
    res.status(403).send({ error: 'current user is no admin' });
    return;
  }
  // user is admin
  next();
};

const app = express();
// allow cross-origin requests (currently only needed for testing in emulator)
app.use(cors({ origin: true }));
app.use(cookieParser());

app.use(validateFirebaseIdToken);
app.use(checkAdminGroup);

app.post('/:id', async (req, res) => {
  // update user with provided id
  try {
    await admin.firestore().collection('persons').doc(req.params.id).update({ isConfirmedMember: true });
  } catch (error) {
    res.status(500).send({ error: 'failed to update person' });
    return;
  }
  res.send({ data: `confirmed person ${req.params.id}` });
});

// export express app as cloud function
export const confirmPerson = functions.region('europe-west1').https.onRequest(app);
