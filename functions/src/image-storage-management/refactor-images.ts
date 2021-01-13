import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { tmpdir } from 'os';
import { join } from 'path';

import * as fs from 'fs-extra';

const runtimeOpts = {
  timeoutSeconds: 300,
};

export const imageRefactoring = functions
  .runWith(runtimeOpts)
  .region('europe-west1')
  .pubsub.schedule('0 2 * * *')
  .timeZone('Europe/Berlin')
  .onRun(async (_) => {
    // default storage bucket
    const bucket = admin.storage().bucket();
    // get all images
    const images = await admin.firestore().collection('images').get();
    console.log(`refactoring ${images.size} images`);
    // create workdir and wait for it
    const workingDir = join(tmpdir(), 'images');
    await fs.ensureDir(workingDir);
    // put all files in the same temp file
    const tmpFilePath = join(workingDir, 'source');

    // move all the images by downloading and reuploading
    const ids: string[] = [];
    images.forEach((img) => ids.push(img.id));
    for (let i = 0; i < ids.length; i++) {
      try {
        // download source image
        console.log(`downloading ${ids[i]}`);
        const destinationFilePath = join('tmp', ids[i]);
        const file = bucket.file(join('uploads', `${ids[i]}_cropped`));
        const [metadata] = await file.getMetadata();
        await file.download({ destination: tmpFilePath });
        // upload it again in the tmp dir
        console.log(`uploading ${ids[i]}`);
        await bucket.upload(tmpFilePath, {
          destination: destinationFilePath,
          metadata: { contentType: metadata.contentType },
        });
        console.log(`${ids[i]} done.`);
      } catch (e) {
        console.log(`${ids[i]} failed. error: ${JSON.stringify(e)}`);
      }
    }

    // cleanup remove the tmp/images from the filesystem
    return fs.remove(workingDir);
  });
