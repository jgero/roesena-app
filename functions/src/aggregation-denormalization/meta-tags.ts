import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const metaTagCleaner = functions
  .region('europe-west1')
  .pubsub.schedule('0 2 * * *')
  .timeZone('Europe/Berlin')
  .onRun(async (_) => {
    // get existing document and delete tags that have 0 occurrences
    const tagsAfter = (await admin.firestore().collection('meta').doc('tags').get()).data();
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
    return null;
  });
