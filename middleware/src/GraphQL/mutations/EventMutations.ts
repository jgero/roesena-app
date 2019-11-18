import { GraphQLNonNull, GraphQLBoolean, GraphQLID } from 'graphql';
import { Request } from 'express';

import { EventType, NewEventInputType, UpdateEventInputType, AcceptEventInputType } from '../types';
import { createEvent, updateEvent, acceptEventForUserBySessionIdWithAmount, deleteEvent } from '../../database/update/event';

export default {
  newEvent: {
    type: EventType,
    args: { input: { type: new GraphQLNonNull(NewEventInputType) } },
    resolve: async (root: any, args: any, context: any) => {
      const auth = (await context).authLevel;
      return createEvent(args.input, auth);
    }
  },
  updateEvent: {
    type: EventType,
    args: { input: { type: new GraphQLNonNull(UpdateEventInputType) } },
    resolve: async (root: any, args: any, context: any) => {
      const auth = (await context).authLevel;
      return updateEvent(args.input, auth);
    }
  },
  deleteEvent: {
    type: GraphQLBoolean,
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: async (root: any, args: any, context: any) => {
      const auth = (await context).authLevel;
      return deleteEvent(args._id, auth);
    }
  },
  acceptEvent: {
    type: GraphQLBoolean,
    args: { input: { type: new GraphQLNonNull(AcceptEventInputType) } },
    resolve: async (root: any, args: any, context: any) => {
      const req: Request = (await context).request;
      return acceptEventForUserBySessionIdWithAmount(req.cookies.session_token, args.input._id, args.input.amount);
    }
  }
};
