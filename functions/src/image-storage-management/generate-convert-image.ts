import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { tmpdir } from 'os';
import { join, dirname, basename } from 'path';

import * as sharp from 'sharp';
import * as fs from 'fs-extra';

interface ConversionTarget {
  width: number;
  height: number;
  dir: string;
  quality: number;
}

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
    const tmpFilePath = join(workingDir, 'source');
    console.log(`working on file ${fileName} in bucket ${object.bucket}`);

    // ensure images dir exists
    await fs.ensureDir(workingDir);
    console.log(`current tempdir contents: ${fs.readdirSync(workingDir)}`);

    // download source image
    await bucket.file(object.name).download({ destination: tmpFilePath });

    // set size, dir and quality for targets
    const targetSizes: ConversionTarget[] = [
      { width: 800, height: 550, dir: 'full', quality: 80 },
      { width: 300, height: 200, dir: 'thumb', quality: 50 },
    ];

    for (const target of targetSizes) {
      const imgName = `${target.dir}@${target.width}x${target.height}_${fileName}`;
      const imgPathFunction = join(workingDir, imgName);
      const imgPathBucket = join(target.dir, imgName);

      // resize source image
      await sharp(tmpFilePath).resize(target.width, target.height).webp({ quality: target.quality }).toFile(imgPathFunction);

      // Upload to storage
      console.log(`converted ${fileName} and setting up upload to ${imgPathBucket} from local converted file ${imgPathFunction}`);
      await bucket.upload(imgPathFunction, {
        destination: imgPathBucket,
        metadata: { contentType: 'image/webp' },
      });
    }

    // remove the source file from the bucket
    await bucket.file(object.name).delete();
    // cleanup remove the tmp/images from the filesystem
    return fs.remove(workingDir);
  });
