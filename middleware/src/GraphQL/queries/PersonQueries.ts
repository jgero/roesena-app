import { PersonType } from '../types';

import { GraphQLNonNull, GraphQLList, GraphQLID } from 'graphql';
import { getAllPersons, getPersonById } from '../../database/get/person';

export default {
  persons: {
    type: new GraphQLNonNull(GraphQLList(PersonType)),
    resolve: async (root: any, args: any, context: any) => {
      const auth = (await context).authLevel;
      return getAllPersons(auth);
    }
  },
  person: {
    type: PersonType,
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: async (root: any, args: any, context: any) => {
      const auth = (await context).authLevel;
      return getPersonById(args._id, auth);
    }
  }
};
