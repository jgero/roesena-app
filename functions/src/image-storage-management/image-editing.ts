import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const spawn = require("child-process-promise").spawn;
const path = require("path");
const os = require("os");
const fs = require("fs");

export const cropImage = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.

  // Exit if this is triggered on a file that is not an image.
  if (!fileBucket || !filePath || !contentType || !contentType.startsWith("image/")) {
    console.log("This is not an image.");
    return false;
  }

  // Get the file name.
  const fileName: string = path.basename(filePath);
  // Exit if the image is already a thumbnail.
  if (fileName.endsWith("_cropped")) {
    console.log("Already cropped.");
    return false;
  }

  // Download file from bucket.
  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  const metadata = {
    contentType: contentType,
  };
  await bucket.file(filePath).download({ destination: tempFilePath });
  console.log("Image downloaded locally to", tempFilePath);
  // resize the image to have the desired size
  await spawn("convert", [tempFilePath, "-resize", "800x550^", "-gravity", "center", "-extent", "800x550", tempFilePath]);
  console.log("Image resized and saved to", tempFilePath);
  // append '_cropped' the file name to be able to tell what files do not have to be touched again
  const thumbFileName = `${fileName}_cropped`;
  const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
  // Uploading the resized image
  await bucket.upload(tempFilePath, {
    destination: thumbFilePath,
    metadata: metadata,
  });
  // delete the original file in the bucket
  await bucket.file(filePath).delete();
  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  return fs.unlinkSync(tempFilePath);
});
