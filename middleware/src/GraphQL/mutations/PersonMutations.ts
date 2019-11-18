import { GraphQLNonNull, GraphQLBoolean, GraphQLID } from 'graphql';

import { PersonType, NewPersonInputType, UpdatePersonInputType } from '../types';
import { createPerson, updatePerson, deletePerson } from '../../database/update/person';

export default {
  newPerson: {
    type: PersonType,
    args: { input: { type: new GraphQLNonNull(NewPersonInputType) } },
    resolve: async (root: any, args: any, context: any) => {
      const auth = (await context).authLevel;
      return createPerson(args.input, auth);
    }
  },
  updatePerson: {
    type: PersonType,
    args: { input: { type: new GraphQLNonNull(UpdatePersonInputType) } },
    resolve: async (root: any, args: any, context: any) => {
      const auth = (await context).authLevel;
      return updatePerson(args.input, auth);
    }
  },
  deletePerson: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: async (root: any, args: any, context: any) => {
      const auth = (await context).authLevel;
      return deletePerson(args._id, auth);
    }
  }
};
