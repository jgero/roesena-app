import { GraphQLNonNull, GraphQLList, GraphQLID } from 'graphql';
import { ObjectID } from 'bson';

import { PersonType } from './types';
import { ConnectionProvider } from '../connection';

export const personQueries = {
  persons: {
    type: new GraphQLNonNull(GraphQLList(PersonType)),
    resolve: persons
  },
  person: {
    type: PersonType,
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: person
  }
};

async function persons(_: any, _args: any, context: any) {
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  const auth = (await context).authLevel;
  // only members can see persons
  if (auth > 1) {
    return await collection
      .find({})
      // only return _id, name and authorityLevel (no password)
      .project({ name: 1, authorityLevel: 1 })
      .toArray();
  } else {
    return [];
  }
}

async function person(_: any, args: any, context: any) {
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  const auth = (await context).authLevel;
  // only members can see persons
  if (auth > 1) {
    return await collection
      .find({ _id: new ObjectID(args._id) })
      // only return _id, name and authorityLevel (no password)
      .project({ name: 1, authorityLevel: 1 })
      .toArray();
  } else {
    return null;
  }
}
