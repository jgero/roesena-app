import { ObjectID } from 'bson';

import { ConnectionProvider } from '../connection';
import { Article } from '../../interfaces';

export async function getArticleById(id: string): Promise<Article | null> {
  const collection = (await ConnectionProvider.Instance.db).collection('articles');
  return await collection.findOne<Article>({ _id: new ObjectID(id) });
}

export async function getAllArticles(): Promise<Article[]> {
  const collection = (await ConnectionProvider.Instance.db).collection('articles');
  return await collection.find<Article>({}).toArray();
}
