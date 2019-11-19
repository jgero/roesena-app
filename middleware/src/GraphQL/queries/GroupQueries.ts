import { GroupType } from '../types';

import { GraphQLNonNull, GraphQLList, GraphQLID } from 'graphql';
import { getAllGroups, getGroupById } from '../../database/get/group';

export default {
  groups: {
    type: new GraphQLNonNull(GraphQLList(GroupType)),
    resolve: async (root: any, args: any, context: any) => {
      return getAllGroups();
    }
  },
  group: {
    type: GroupType,
    args: { _id: { type: GraphQLNonNull(GraphQLID) } },
    resolve: async (root: any, args: any, context: any) => {
      return getGroupById(args._id);
    }
  }
};
