import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { tmpdir } from 'os';
import { join, dirname, basename } from 'path';
import { targetSizes, getFilenameForTarget } from '../utils/image-conversion-filenames';

import * as sharp from 'sharp';
import * as fs from 'fs-extra';

export const generateThumbAndConvertImage = functions
  .region('europe-west1')
  .storage.object()
  .onFinalize(async (object) => {
    // exit if this function is triggered on a file that is not an image
    if (!object.contentType || !object.contentType.includes('image')) {
      console.log('This is not an image.');
      return false;
    }
    // or in the wrong directory
    if (!object.name || dirname(object.name) !== 'tmp') {
      console.log('File is not in tmp directory.');
      return false;
    }

    // storage bucket name that contains the file
    const bucket = admin.storage().bucket(object.bucket);

    // setup file and dir names
    const fileName: string = basename(object.name);
    const workingDir = join(tmpdir(), 'images');
    const tmpFilePath = join(workingDir, fileName + '_source_' + Math.random().toString(36).substr(2, 9));
    console.log(`working on file ${fileName} in bucket ${object.bucket}`);

    // ensure images dir exists
    await fs.ensureDir(workingDir);
    console.log(`current tempdir contents: ${fs.readdirSync(workingDir)}`);

    // download source image
    await bucket.file(object.name).download({ destination: tmpFilePath });

    for (const target of targetSizes) {
      const imgName = getFilenameForTarget(target, fileName);
      // add random id to end of filename to avoid weird file overwrite bug
      const imgPathFunction = join(workingDir, imgName + '_' + Math.random().toString(36).substr(2, 9));
      const imgPathBucket = join(target.dir, imgName);

      // resize source image
      await sharp(tmpFilePath).resize(target.width, target.height).webp({ quality: target.quality }).toFile(imgPathFunction);

      // Upload to storage
      console.log(`converted ${fileName} and setting up upload to ${imgPathBucket} from local converted file ${imgPathFunction}`);
      await bucket.upload(imgPathFunction, {
        destination: imgPathBucket,
        metadata: { contentType: 'image/webp' },
      });
      // delete the file in the function
      console.log(`delete ${imgPathFunction} in the function`);
      await fs.remove(imgPathFunction);
    }

    // remove the source file from the bucket
    await bucket.file(object.name).delete();
    // delete the source file in the function
    console.log(`delete ${tmpFilePath} in the function`);
    await fs.remove(tmpFilePath);
    // cleanup remove the tmp/images from the filesystem
    return fs.remove(workingDir);
  });
