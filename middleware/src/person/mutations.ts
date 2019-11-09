import { GraphQLNonNull, GraphQLBoolean, GraphQLID } from 'graphql';

import { PersonType, NewPersonInputType, UpdatePersonInputType } from './types';
import { ConnectionProvider } from '../connection';
import { ObjectID } from 'bson';

export const personMutations = {
  newPerson: {
    type: PersonType,
    args: { input: { type: new GraphQLNonNull(NewPersonInputType) } },
    resolve: newPerson
  },
  updatePerson: {
    type: PersonType,
    args: { input: { type: new GraphQLNonNull(UpdatePersonInputType) } },
    resolve: updatePerson
  },
  deletePerson: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: deletePerson
  }
};

async function newPerson(_: any, args: any, context: any) {
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  const auth: number = (await context).authLevel;
  // only presidency or admins can create persons
  // you can only create users with lower auth level than your own
  if (auth > 3 && auth > args.input.authorityLevel) {
    const result = await collection.insertOne(args.input);
    // the result.ops[0] contains the data that was inserted by the query
    if (result.insertedCount > 0) {
      return result.ops[0];
    }
  }
  return null;
}

async function updatePerson(_: any, args: any, context: any) {
  const { _id, name, authorityLevel } = args.input;
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  const auth = (await context).authLevel;
  // only presidency or admins can update persons
  // new auth level cannot be the same or higher as own
  if (auth > 3 && auth > args.input.authorityLevel) {
    const result = await collection.findOneAndUpdate(
      // only update if auth of person to update is lower than the own auth level
      { _id: new ObjectID(_id), authorityLevel: { $lt: auth } },
      // update name and authorrityLevel
      { $set: { name, authorityLevel } },
      { returnOriginal: false }
    );
    return result.value;
  }
  return null;
}

async function deletePerson(_: any, args: any, context: any) {
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  const auth = (await context).authLevel;
  // only presidency or admins can delete persons and only persons with lower auth level
  if (auth > 3) {
    const result = await collection.deleteOne({ _id: new ObjectID(args._id), authorityLevel: { $lt: auth } });
    return result.deletedCount === 1;
  }
  return false;
}
