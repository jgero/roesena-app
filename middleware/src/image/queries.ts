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

async function images(_: any, _args: any, _context: any) {
  const collection = (await ConnectionProvider.Instance.db).collection('images');
  return await collection.find({}).toArray();
}

async function image(_: any, args: any, _context: any) {
  const collection = (await ConnectionProvider.Instance.db).collection('images');
  return await collection.findOne({ _id: new ObjectID(args._id) });
}
