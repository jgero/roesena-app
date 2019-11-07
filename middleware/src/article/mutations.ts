import { GraphQLNonNull, GraphQLBoolean, GraphQLID } from 'graphql';

import { ConnectionProvider } from '../connection';
import { ObjectID } from 'bson';
import { ArticleType, NewArticleInputType, UpdateArticleInputType } from './types';
import { mapIdsToImages } from './queries';

export const articleMutations = {
  newArticle: {
    type: ArticleType,
    args: { input: { type: new GraphQLNonNull(NewArticleInputType) } },
    resolve: newArticle
  },
  updateArticle: {
    type: ArticleType,
    args: { input: { type: new GraphQLNonNull(UpdateArticleInputType) } },
    resolve: updateArticle
  },
  deleteArticle: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: deleteArticle
  }
};

async function newArticle(_: any, args: any, context: any) {
  const collection = (await ConnectionProvider.Instance.db).collection('articles');
  const auth: number = (await context).authLevel;
  // only members and above
  if (auth > 1) {
    const result = await collection.insertOne(args.input);
    // the result.ops[0] contains the data that was inserted by the query
    return (await mapIdsToImages([result.ops[0]]))[0];
  }
  return null;
}

async function updateArticle(_: any, args: any, context: any) {
  const { _id, date, title, content, images } = args.input;
  const collection = (await ConnectionProvider.Instance.db).collection('articles');
  const auth = (await context).authLevel;
  // only group leaders and above can edit images
  if (auth > 2) {
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectID(_id) },
      // update the image
      { $set: { date, title, content, images } },
      { returnOriginal: false }
    );
    return (await mapIdsToImages([result.value]))[0];
  }
  return null;
}

async function deleteArticle(_: any, args: any, context: any) {
  const collection = (await ConnectionProvider.Instance.db).collection('articles');
  const auth = (await context).authLevel;
  // only group leaders and above can delete images
  if (auth > 2) {
    const result = await collection.deleteOne({ _id: new ObjectID(args._id) });
    return result.deletedCount === 1;
  }
  return false;
}
