import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const cors = require('cors')({ origin: true });

export const respondToEvent = functions.region('europe-west1').https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (!req.body.data || !req.body.data.id || req.body.data.amount === undefined || req.body.data.amount < 0) {
      res.status(400).send('invalid request body');
      return;
    }
    const authToken = req.get('Authorization');
    if (!authToken) {
      res.status(401).send('auth token missing');
      return;
    }
    const tokenId = authToken.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(tokenId);
    const doc = (await admin.firestore().collection('events').doc(req.body.data.id).get()).data();
    // update the doc with the new amount
    if (!doc) {
      res.status(400).send('invalid request id');
      return;
    }
    if (!doc.deadline) {
      res.status(400).send('event does not have a deadline');
      return;
    }
    // if deadline is already over
    if (new Date(doc.deadline.toDate()).getTime() < new Date().getTime()) {
      res.status(400).send('dedline already over');
      return;
    }
    // if person is not invited to event
    let invited = false;
    for (const id in doc.participants) {
      if (id === decoded.uid) invited = true;
    }
    if (!invited) {
      res.status(400).send('person is not invited to event');
      return;
    }
    // set the document again
    await admin
      .firestore()
      .collection('events')
      .doc(req.body.data.id)
      .update({ [`participants.${decoded.uid}.amount`]: req.body.data.amount });
    res.status(200).send({ data: { success: true } });
  });
});
