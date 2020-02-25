import * as functions from "firebase-functions";
import admin = require("firebase-admin");
admin.initializeApp();

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
