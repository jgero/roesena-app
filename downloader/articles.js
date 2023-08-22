const { initializeApp,  cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
const fs = require('fs');

var serviceAccount = require("../key.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

getImageNameMap().then(el => {
  el.forEach(articleData => {
    if (!articleData.name) {
      console.log(articleData.data);
      return;
    }
    fs.writeFile(
      `bin/${articleData.name}.txt`,
      articleData.data,
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  });
});

async function getImageNameMap() {
  const allQueryRes = await db.collection("articles").get();
  let tracker = {};

  const dataToName = (rawData) => {
    const tags = Object.keys(rawData.tags)
      .map(tag => tag.replace(" ", "-"));
    let name;
    if (tags.length == 0) {
       name = "NO-TAGS";
    } else {
       name = tags.join("-");
    }
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
    .map(it => ({name: dataToName(it.data()), data: it.data().content}))
}

