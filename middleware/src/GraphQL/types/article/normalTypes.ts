import { GraphQLString, GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLInt } from 'graphql';

import { ImageType } from '../image';
import { getImageById } from '../../../database/get/image';

export const ArticleType = new GraphQLObjectType({
  name: 'Article',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    date: { type: GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLNonNull(GraphQLString) },
    images: {
      type: GraphQLNonNull(GraphQLList(ImageType)),
      resolve: async (parent: any, args: any, context: any) => {
        if (parent.images) {
          return await Promise.all(
            (parent.images as string[]).map(imageId => {
              return getImageById(imageId);
            })
          );
        } else {
          return [];
        }
      }
    }
  })
});
