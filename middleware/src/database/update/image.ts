import { ObjectID } from 'bson';

import { ConnectionProvider } from '../connection';
import { Image } from '../../interfaces';

export async function createImage(newImage: Image, auth: number): Promise<Image | null> {
  const collection = (await ConnectionProvider.Instance.db).collection('images');
  // only group leaders and above an add new images
  if (auth > 2) {
    const result = await collection.insertOne(newImage);
    // the result.ops[0] contains the data that was inserted by the query
    return result.ops[0] as Image;
  }
  return null;
}

export async function updateImage(imageToUpdate: Image, auth: number): Promise<Image | null> {
  const collection = (await ConnectionProvider.Instance.db).collection('images');
  const { _id, description, data, tags } = imageToUpdate;
  // only group leaders and above can edit images
  if (auth > 2) {
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectID(_id) },
      // update the image
      { $set: { description, data, tags } },
      { returnOriginal: false }
    );
    return result.value;
  }
  return null;
}

export async function deleteImage(imageId: string, auth: number): Promise<boolean> {
  const imageCollection = (await ConnectionProvider.Instance.db).collection('images');
  const articleCollection = (await ConnectionProvider.Instance.db).collection('articles');
  // only group leaders and above can delete images
  if (auth > 2) {
    // remove the references to the image, which will be deleted, in all the articles
    await articleCollection.updateMany({}, { $pull: { images: imageId } });
    // delete the image
    const result = await imageCollection.deleteOne({ _id: new ObjectID(imageId) });
    return result.deletedCount === 1;
  }
  return false;
}
