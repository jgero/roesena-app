import { GraphQLNonNull, GraphQLBoolean, GraphQLID } from 'graphql';

import { ArticleType, NewArticleInputType, UpdateArticleInputType } from '../types';
import { createArticle, updateArticle, deleteArticle } from '../../database/update/article';

export default {
  newArticle: {
    type: ArticleType,
    args: { input: { type: new GraphQLNonNull(NewArticleInputType) } },
    resolve: async (root: any, args: any, context: any) => {
      const auth = (await context).authLevel;
      return createArticle(args.input, auth);
    }
  },
  updateArticle: {
    type: ArticleType,
    args: { input: { type: new GraphQLNonNull(UpdateArticleInputType) } },
    resolve: async (root: any, args: any, context: any) => {
      const auth = (await context).authLevel;
      return updateArticle(args.input, auth);
    }
  },
  deleteArticle: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: async (root: any, args: any, context: any) => {
      const auth = (await context).authLevel;
      return deleteArticle(args._id, auth);
    }
  }
};
