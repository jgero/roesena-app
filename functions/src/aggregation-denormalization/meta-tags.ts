import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const metaTagWriteListener = functions
  .region('europe-west1')
  .firestore.document('meta/tags')
  .onWrite(async (change) => {
    if (!change.before.exists) {
      // should never happen
    } else if (change.before.exists && change.after.exists) {
      // Updating existing document : delete tags that have 0 occurrences
      const tagsAfter = change.after.data() as { [key: string]: number };
      const tagsUpdateOp: { [key: string]: any } = {};
      for (const key in tagsAfter) {
        if (tagsAfter.hasOwnProperty(key) && tagsAfter[key] <= 0) {
          tagsUpdateOp[key] = admin.firestore.FieldValue.delete();
        }
      }
      // run update if anything has to be changed
      if (tagsUpdateOp && Object.keys(tagsUpdateOp).length !== 0) {
        await admin.firestore().collection('meta').doc('tags').update(tagsUpdateOp);
      }
      return true;
    } else if (!change.after.exists) {
      // should never happen
    }
    return false;
  });
