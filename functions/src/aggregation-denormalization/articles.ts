import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const articleWriteListener = functions.firestore.document("articles/{articleId}").onWrite((change) => {
  if (!change.before.exists) {
    // New document Created : add one to count
    return admin
      .firestore()
      .collection("meta")
      .doc("articles")
      .update({ amount: admin.firestore.FieldValue.increment(1) });
  } else if (change.before.exists && change.after.exists) {
    // Updating existing document : Do nothing
  } else if (!change.after.exists) {
    // Deleting document : subtract one from count
    return admin
      .firestore()
      .collection("meta")
      .doc("articles")
      .update({ amount: admin.firestore.FieldValue.increment(-1) });
  }
  return false;
});
