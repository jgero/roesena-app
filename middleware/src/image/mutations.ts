import { GraphQLNonNull, GraphQLBoolean, GraphQLID } from 'graphql';

import { ConnectionProvider } from '../connection';
import { ObjectID } from 'bson';
import { ImageType, NewImageInputType, UpdateImageInputType } from './types';

export const imageMutations = {
  newImage: {
    type: ImageType,
    args: { input: { type: new GraphQLNonNull(NewImageInputType) } },
    resolve: newImage
  },
  updateImage: {
    type: ImageType,
    args: { input: { type: new GraphQLNonNull(UpdateImageInputType) } },
    resolve: updateImage
  },
  deleteImage: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: deleteImage
  }
};

async function newImage(_: any, args: any, context: any) {
  const collection = (await ConnectionProvider.Instance.db).collection('images');
  const auth: number = (await context).authLevel;
  // only members and above
  if (auth > 1) {
    const result = await collection.insertOne(args.input);
    // the result.ops[0] contains the data that was inserted by the query
    return result.ops[0];
  }
  return null;
}

async function updateImage(_: any, args: any, context: any) {
  const { _id, description, data, tags } = args.input;
  const collection = (await ConnectionProvider.Instance.db).collection('images');
  const auth = (await context).authLevel;
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

async function deleteImage(_: any, args: any, context: any) {
  const collection = (await ConnectionProvider.Instance.db).collection('images');
  const auth = (await context).authLevel;
  // only group leaders and above can delete images
  if (auth > 2) {
    const result = await collection.deleteOne({ _id: new ObjectID(args._id) });
    return result.deletedCount === 1;
  }
  return false;
}
