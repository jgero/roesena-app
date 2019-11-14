import { GraphQLNonNull, GraphQLList, GraphQLID } from 'graphql';
import { ObjectID } from 'bson';

import { ConnectionProvider } from '../connection';
import { ArticleType } from './types';

export const articleQueries = {
  articles: {
    type: new GraphQLNonNull(GraphQLList(ArticleType)),
    resolve: articles
  },
  article: {
    type: ArticleType,
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: article
  }
};

async function articles(_: any, _args: any, context: any) {
  const collection = (await ConnectionProvider.Instance.db).collection('articles');
  return await mapIdsToImages(await collection.find({}).toArray());
}

async function article(_: any, args: any, context: any) {
  const collection = (await ConnectionProvider.Instance.db).collection('articles');
  return (await mapIdsToImages(await collection.find({ _id: new ObjectID(args._id) }).toArray()))[0];
}

export async function mapIdsToImages(articles: any[]) {
  const collection = (await ConnectionProvider.Instance.db).collection('images');
  return await articles.map(async article => {
    // map the ids to the image objects
    article.images = await article.images.map(async imageID => {
      let image;
      try {
        image = await collection.findOne({ _id: new ObjectID(imageID) });
      } catch (e) {
        image = undefined;
      }
      return await image;
    });
    return await article;
  });
}
