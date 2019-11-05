import { GraphQLNonNull, GraphQLList, GraphQLID } from 'graphql';
import { ObjectID } from 'bson';

import { ConnectionProvider } from '../connection';
import { ImageType } from './types';

export const imageQueries = {
  images: {
    type: new GraphQLNonNull(GraphQLList(ImageType)),
    resolve: images
  },
  image: {
    type: ImageType,
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: image
  }
};

async function images(_: any, _args: any, context: any) {
  const collection = (await ConnectionProvider.Instance.db).collection('images');
  const auth = (await context).authLevel;
  // only members can see images
  if (auth > 1) {
    return await collection.find({}).toArray();
  } else {
    return [];
  }
}

async function image(_: any, args: any, context: any) {
  const collection = (await ConnectionProvider.Instance.db).collection('images');
  const auth = (await context).authLevel;
  // only members can see persons
  if (auth > 1) {
    return await collection.find({ _id: new ObjectID(args._id) }).toArray();
  } else {
    return null;
  }
}
