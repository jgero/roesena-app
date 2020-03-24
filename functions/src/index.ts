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
      res.status(400).send({ data: { error: "invalid request body" } });
      return;
    }
    const authToken = req.get("Authorization");
    if (!authToken) {
      res.status(401).send({ data: { error: "auth token missing" } });
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
      res.status(400).send({ data: { error: "invalid request id" } });
      return;
    }
    const newParticipants = doc.participants.map((participant: { id: string; amount: number }) => {
      if (participant.id === decoded.uid) {
        participant.amount = req.body.data.amount;
      }
      return participant;
    });
    // set the document again
    await admin
      .firestore()
      .collection("events")
      .doc(req.body.data.id)
      .update({ participants: newParticipants });
    res.status(200).send({ data: { success: true } });
  });
});
