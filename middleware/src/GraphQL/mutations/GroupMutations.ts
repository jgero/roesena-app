import { GraphQLNonNull, GraphQLBoolean, GraphQLID } from 'graphql';

import { GroupType } from '../types';
import { NewGroupInputType, UpdateGroupInputType } from '../types/group/inputTypes';
import { createGroup, updateGroup, deleteGroup } from '../../database/update/group';

export default {
  newGroup: {
    type: GroupType,
    args: { input: { type: new GraphQLNonNull(NewGroupInputType) } },
    resolve: async (root: any, args: any, context: any) => {
      const auth = (await context).authLevel;
      return createGroup(args.input, auth);
    }
  },
  updateGroup: {
    type: GroupType,
    args: { input: { type: new GraphQLNonNull(UpdateGroupInputType) } },
    resolve: async (root: any, args: any, context: any) => {
      const auth = (await context).authLevel;
      return updateGroup(args.input, auth);
    }
  },
  deleteGroup: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: async (root: any, args: any, context: any) => {
      const auth = (await context).authLevel;
      return deleteGroup(args._id, auth);
    }
  }
};
