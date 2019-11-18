import { GraphQLNonNull, GraphQLBoolean, GraphQLID } from 'graphql';

import { ImageType, NewImageInputType, UpdateImageInputType } from '../types';
import { createImage, updateImage, deleteImage } from '../../database/update/image';

export default {
  newImage: {
    type: ImageType,
    args: { input: { type: new GraphQLNonNull(NewImageInputType) } },
    resolve: async (root: any, args: any, context: any) => {
      const auth: number = (await context).authLevel;
      return createImage(args.input, auth);
    }
  },
  updateImage: {
    type: ImageType,
    args: { input: { type: new GraphQLNonNull(UpdateImageInputType) } },
    resolve: async (root: any, args: any, context: any) => {
      const auth: number = (await context).authLevel;
      return updateImage(args.input, auth);
    }
  },
  deleteImage: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: async (root: any, args: any, context: any) => {
      const auth: number = (await context).authLevel;
      return deleteImage(args._id, auth);
    }
  }
};
