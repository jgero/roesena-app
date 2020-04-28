import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const imageWriteListener = functions.firestore.document("images/{imageId}").onWrite((change) => {
  if (!change.before.exists) {
    // New document Created : add one to count
    return admin
      .firestore()
      .collection("meta")
      .doc("images")
      .update({ amount: admin.firestore.FieldValue.increment(1) });
  } else if (change.before.exists && change.after.exists) {
    // Updating existing document : Do nothing
  } else if (!change.after.exists) {
    // Deleting document : subtract one from count
    return admin
      .firestore()
      .collection("meta")
      .doc("images")
      .update({ amount: admin.firestore.FieldValue.increment(-1) });
  }
  return false;
});
