import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sharp from 'sharp';

const path = require('path');
const os = require('os');
const fs = require('fs');

const THUMB_WIDTH = 300;
const THUMB_HEIGHT = 200;
const FULL_WIDTH = 800;
const FULL_HEIGHT = 550;

export const convertImage = functions
  .region('europe-west1')
  .storage.object()
  .onFinalize(async (object) => {
    // the storage bucket that contains the file
    const fileBucket = object.bucket;
    // file path in the bucket
    const filePath = object.name;
    // name of the file
    const fileName =  path.basename(filePath);
    // file content type
    const contentType = object.contentType;

    // exit if this is triggered on a file that is not an image
    if (!fileBucket || !filePath || !contentType || !contentType.startsWith('image/')) {
      console.log('This is not an image.');
      return null;
    }

    // exit if the image is not in the tmp directory
    if (!filePath.startsWith('tmp/')) {
      console.log('not a fresh upload');
      return null;
    }

    // download file from bucket
    const bucket = admin.storage().bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    await bucket.file(filePath).download({ destination: tempFilePath });

    // metadata for upload streams
    const metadata = {
      contentType: 'image/webp',
    };

    // convert and write thumbnail
    // thumbs get a prefix
    const thumbFilePath = `thumbnails/thumb_${fileName}`;
    // create write stream for uploading thumbnail
    const thumbnailUploadStream = bucket.file(thumbFilePath).createWriteStream({metadata});
    // resize and convert to webp and pipe into upload stream
    const toThumbnailTransformer = sharp().resize({ width: THUMB_WIDTH, height: THUMB_HEIGHT, fit: 'cover', position: 'centre' }).webp().pipe(thumbnailUploadStream);
    // read stream from temp fs into transformer
    await bucket.file(tempFilePath).createReadStream().pipe(toThumbnailTransformer);

    // convert and write full sized image
    const fullImageFilePath = `fullsized/${fileName}`;
    // create write stream for uploading full sized image
    const fullImageUploadStream = bucket.file(fullImageFilePath).createWriteStream({metadata});
    // resize and convert to webp and pipe into upload stream
    const toFullImageTransformer = sharp().resize({ width: FULL_WIDTH, height: FULL_HEIGHT, fit: 'cover', position: 'centre' }).webp().pipe(fullImageUploadStream);
    // read stream from temp fs into transformer
    await bucket.file(tempFilePath).createReadStream().pipe(toFullImageTransformer);

    // delete original image in the bucket
    await bucket.file(filePath).delete();
    // clean up temp fs
    await fs.unlinkSync(tempFilePath);
    return null;
  });
