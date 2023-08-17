const { initializeApp,  cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');

var serviceAccount = require("../key.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const bucket = getStorage().bucket("gs://sechta-narren.appspot.com");

getImageNameMap().then(el => {
  el.forEach(imageMetadata => {
    downloadImage(imageMetadata, "bin").then(() => console.log("downloaded one"));
  });
});

async function getImageNameMap() {
  const allQueryRes = await db.collection("images").get();
  let tracker = {};

  const dataToName = (rawData) => {
    const tags = Object.keys(rawData.tags)
      .map(tag => tag.replace(" ", "-"));
    const name = tags.join("-");
    let indexedName = "";
    if (tracker[name]) {
      indexedName = `${name}(${tracker[name]})`;
      tracker[name] = ( tracker[name] + 1 );
    } else {
      indexedName = name;
      tracker[name] = 1;
    }
    return indexedName;
  };

  return allQueryRes.docs
    .map(it => ({name: dataToName(it.data()), id: it.id}))
}

async function downloadImage(metadata, dirName) {
  await bucket.file(`full/full@800x550_${metadata.id}`).download({ destination: `${dirName}/${metadata.name}.webp` });
}

