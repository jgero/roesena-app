import * as functions from "firebase-functions";
const cors = require("cors")({ origin: true });
import admin = require("firebase-admin");
admin.initializeApp();

// set to eur3 somehow
export const createUser = functions.auth.user().onCreate(user => {
  return admin
    .firestore()
    .collection("persons")
    .doc(user.uid)
    .set({ authLevel: 0, name: user.email });
});

export const deleteUser = functions.auth.user().onDelete(user => {
  return admin
    .firestore()
    .collection("persons")
    .doc(user.uid)
    .delete();
});

export const deleteImages = functions.firestore.document("images/{imageId}").onDelete((snapshot, context) => {
  const { imageId } = context.params;
  return admin
    .storage()
    .bucket()
    .deleteFiles({ prefix: `uploads/${imageId}` });
});

export const respondToEvent = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (!req.body.data || !req.body.data.id || req.body.data.amount === undefined || req.body.data.amount < 0) {
      res.status(400).send("invalid request body");
      return;
    }
    const authToken = req.get("Authorization");
    if (!authToken) {
      res.status(401).send("auth token missing");
      return;
    }
    const tokenId = authToken.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(tokenId);
    const doc = (
      await admin
        .firestore()
        .collection("events")
        .doc(req.body.data.id)
        .get()
    ).data();
    // update the doc with the new amount
    if (!doc) {
      res.status(400).send("invalid request id");
      return;
    }
    // if there is no deadline or it is already over
    if (!doc.deadline || new Date(doc.deadline.toDate()).getTime() < new Date().getTime()) {
      res.status(400).send("dedline already over");
      return;
    }
    // if person is not invited to event
    let invited = false;
    for (const id in doc.participants) {
      if (id === decoded.uid) invited = true;
    }
    if (!invited) {
      res.status(400).send("person is not invited to event");
      return;
    }
    // set the document again
    await admin
      .firestore()
      .collection("events")
      .doc(req.body.data.id)
      .update({ [`participants.${decoded.uid}`]: req.body.data.amount });
    res.status(200).send({ data: { success: true } });
  });
});
