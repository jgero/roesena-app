import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { targetSizes, getFullObjectNameForTarget } from '../utils/image-conversion-filenames';

export const deleteImages = functions
  .region('europe-west1')
  .firestore.document('images/{imageId}')
  .onDelete((_snapshot, context) => {
    // take image id from document trigger parameter
    const { imageId } = context.params;
    const promises: Promise<any>[] = [];
    // all target sizes have to be deleted
    for (const target of targetSizes) {
      // create the delete operation for the target
      promises.push(admin.storage().bucket().file(getFullObjectNameForTarget(target, imageId)).delete());
    }
    // run the delete operations
    return Promise.all(promises);
  });
