import { GraphQLNonNull, GraphQLList, GraphQLID } from 'graphql';

import { ArticleType } from '../types';
import { getArticleById, getAllArticles } from '../../database/get/article';

export default {
  articles: {
    type: new GraphQLNonNull(GraphQLList(ArticleType)),
    resolve: async (root: any, args: any, context: any) => {
      return getAllArticles();
    }
  },
  article: {
    type: ArticleType,
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: async (root: any, args: any, context: any) => {
      return getArticleById(args._id);
    }
  }
};
