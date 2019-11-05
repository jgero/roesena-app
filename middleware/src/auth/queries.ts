import { Request } from 'express';

import { Person } from '../interfaces';
import { ConnectionProvider } from '../connection';
import { PersonType } from '../person/types';

export const authQueries = {
  me: {
    type: PersonType,
    resolve: me
  }
};

async function me(_a: any, _b: any, context: any): Promise<Person | null> {
  const req: Request = (await context).request;
  // user has to be logged in to get person data
  if (req.cookies.session_token) {
    const collection = (await ConnectionProvider.Instance.db).collection('persons');
    return await collection.findOne<Person>({ sessionId: req.cookies.session_token });
  } else {
    return null;
  }
}
