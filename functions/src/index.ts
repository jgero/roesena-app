import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
const cors = require("cors")({ origin: true });

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

// set to eur3 somehow
export const createUser = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection("persons").doc(user.uid).set({ isConfirmedMember: false, name: user.email, groups: {} });
});

export const deleteUser = functions.auth.user().onDelete((user) => {
  return admin.firestore().collection("persons").doc(user.uid).delete();
});

export const deleteImages = functions.firestore.document("images/{imageId}").onDelete((snapshot, context) => {
  const { imageId } = context.params;
  return admin
    .storage()
    .bucket()
    .deleteFiles({ prefix: `uploads/${imageId}_cropped` });
});

export const respondToEvent = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (!req.body.data || !req.body.data.id || req.body.data.amount === undefined || req.body.data.amount < 0) {
      res.status(400).send("invalid request body");
      return;
    }
    const authToken = req.get("Authorization");
    if (!authToken) {
      res.status(401).send("auth token missing");
      return;
    }
    const tokenId = authToken.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(tokenId);
    const doc = (await admin.firestore().collection("events").doc(req.body.data.id).get()).data();
    // update the doc with the new amount
    if (!doc) {
      res.status(400).send("invalid request id");
      return;
    }
    if (!doc.deadline) {
      res.status(400).send("event does not have a deadline");
      return;
    }
    // if deadline is already over
    if (new Date(doc.deadline.toDate()).getTime() < new Date().getTime()) {
      res.status(400).send("dedline already over");
      return;
    }
    // if person is not invited to event
    let invited = false;
    for (const id in doc.participants) {
      if (id === decoded.uid) invited = true;
    }
    if (!invited) {
      res.status(400).send("person is not invited to event");
      return;
    }
    // set the document again
    await admin
      .firestore()
      .collection("events")
      .doc(req.body.data.id)
      .update({ [`participants.${decoded.uid}`]: req.body.data.amount });
    res.status(200).send({ data: { success: true } });
  });
});
