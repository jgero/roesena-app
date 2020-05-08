import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const eventWriteListener = functions
  .region('europe-west1')
  .firestore.document('events/{eventId}')
  .onWrite(async (change) => {
    if (!change.before.exists) {
      // map tags element to increment 1
      const tags: { [key: string]: any } = (change.after.data() as any).tags as { [key: string]: boolean };
      for (const key in tags) {
        if (tags.hasOwnProperty(key)) {
          tags[key] = admin.firestore.FieldValue.increment(1);
        }
      }
      // run increment update operation on tag meta document
      if (tags && Object.keys(tags).length !== 0) {
        await admin.firestore().collection('meta').doc('tags').update(tags);
      }
      return true;
    } else if (change.before.exists && change.after.exists) {
      // Updating existing document : update tag counter
      const tagsBefore = (change.before.data() as any).tags as { [key: string]: boolean };
      const tagsAfter = (change.after.data() as any).tags as { [key: string]: boolean };
      const tagsUpdateOp: { [key: string]: any } = {};
      // tags that were there before and not after -> got removed -> increment -1
      for (const key in tagsBefore) {
        if (tagsBefore.hasOwnProperty(key) && !tagsAfter[key]) {
          tagsUpdateOp[key] = admin.firestore.FieldValue.increment(-1);
        }
      }
      // tags that weren't there before, but after -> got added -> increment 1
      for (const key in tagsAfter) {
        if (tagsAfter.hasOwnProperty(key) && !tagsBefore[key]) {
          tagsUpdateOp[key] = admin.firestore.FieldValue.increment(1);
        }
      }
      // run increment update operation on tag meta document
      if (tagsUpdateOp && Object.keys(tagsUpdateOp).length !== 0) {
        await admin.firestore().collection('meta').doc('tags').update(tagsUpdateOp);
      }
      return true;
    } else if (!change.after.exists) {
      // map tags element to increment -1
      const tags: { [key: string]: any } = (change.before.data() as any).tags as { [key: string]: boolean };
      for (const key in tags) {
        if (tags.hasOwnProperty(key)) {
          tags[key] = admin.firestore.FieldValue.increment(-1);
        }
      }
      // run increment update operation on tag meta document
      if (tags && Object.keys(tags).length !== 0) {
        await admin.firestore().collection('meta').doc('tags').update(tags);
      }
      return true;
    }
    return false;
  });
