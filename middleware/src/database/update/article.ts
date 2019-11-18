import { ObjectID } from 'bson';

import { Article } from '../../interfaces';
import { ConnectionProvider } from '../connection';

export async function createArticle(newArticle: Article, auth: number): Promise<Article | null> {
  const collection = (await ConnectionProvider.Instance.db).collection('articles');
  // only group leaders and above can create articles
  if (auth > 1) {
    const result = await collection.insertOne(newArticle);
    // the result.ops[0] contains the data that was inserted by the query
    return result.ops[0] as Article;
  }
  return null;
}

export async function updateArticle(articleToUpdate: Article, auth: number): Promise<Article | null> {
  const collection = (await ConnectionProvider.Instance.db).collection('articles');
  const { _id, date, title, content, images } = articleToUpdate;
  // only group leaders and above can edit articles
  if (auth > 2) {
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectID(_id) },
      // update the article
      { $set: { date, title, content, images } },
      { returnOriginal: false }
    );
    return result.value;
  }
  return null;
}

export async function deleteArticle(articleId: string, auth: number): Promise<boolean> {
  const collection = (await ConnectionProvider.Instance.db).collection('articles');
  // only group leaders and above can delete images
  if (auth > 2) {
    const result = await collection.deleteOne({ _id: new ObjectID(articleId) });
    return result.deletedCount === 1;
  }
  return false;
}
