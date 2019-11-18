import { ImageType } from '../types';

import { GraphQLNonNull, GraphQLList, GraphQLID } from 'graphql';
import { getAllImages, getImageById } from '../../database/get/image';

export default {
  images: {
    type: new GraphQLNonNull(GraphQLList(ImageType)),
    resolve: async (root: any, args: any, context: any) => {
      return await getAllImages();
    }
  },
  image: {
    type: ImageType,
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: async (root: any, args: any, context: any) => {
      return await getImageById(args._id);
    }
  }
};
