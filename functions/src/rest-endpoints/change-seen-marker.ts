import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const cors = require('cors')({ origin: true });

export const changeSeenMarker = functions.region('europe-west1').https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (!req.body.data || !req.body.data.id) {
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
    // check if event exists
    if (!doc) {
      res.status(400).send('invalid request id');
      return;
    }
    // if person is not invited to event
    const part = doc.participants.find((p) => p.id === decoded.uid);
    if (!part) {
      res.status(400).send('person is not invited to event');
      return;
    }
    // if person has no unseen changes
    if (!part.hasUnseenChanges) {
      res.status(204).send('person has no unseen changes');
      return;
    }
    // set the document again
    await admin
      .firestore()
      .collection('events')
      .doc(req.body.data.id)
      .update({ [`participants.${decoded.uid}.hasUnseenChanges`]: false });
    res.status(200).send({ data: { success: true } });
  });
});
