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
      console.log('File is in wrong directory.');
      return false;
    }

    // storage bucket name that contains the file
    const bucket = admin.storage().bucket(object.bucket);

    // setup file and dir names
    const fileName: string = basename(object.name);
    const workingDir = join(tmpdir(), 'images');
    const tmpFilePath = join(workingDir, 'source');

    // ensure images dir exists
    await fs.ensureDir(workingDir);
    // download source image
    await bucket.file(object.name).download({ destination: tmpFilePath });

    // set size, dir and quality for targets
    const targetSizes: ConversionTarget[] = [
      { width: 800, height: 550, dir: 'full', quality: 80 },
      { width: 300, height: 200, dir: 'thumb', quality: 50 },
    ];

    const uploadPromises = targetSizes.map(async (target) => {
      const imgName = `${target.dir}@${target.width}x${target.height}_${fileName}`;
      const imgPath = join(workingDir, imgName);

      // resize source image
      await sharp(tmpFilePath).resize(target.width, target.height).webp({ quality: target.quality }).toFile(imgPath);

      // Upload to storage
      return bucket.upload(imgPath, {
        destination: join(target.dir, imgName),
        metadata: { contentType: 'image/webp' },
      });
    });

    // run the upload operations
    await Promise.all(uploadPromises);
    // remove the source file from the bucket
    await bucket.file(object.name).delete();
    // cleanup remove the tmp/images from the filesystem
    return fs.remove(workingDir);
  });
