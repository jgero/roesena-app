import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const deleteImages = functions.firestore.document("images/{imageId}").onDelete((snapshot, context) => {
  const { imageId } = context.params;
  return admin
    .storage()
    .bucket()
    .deleteFiles({ prefix: `uploads/${imageId}_cropped` });
});
