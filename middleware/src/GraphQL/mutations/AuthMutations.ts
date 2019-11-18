import { GraphQLNonNull, GraphQLBoolean, GraphQLID } from 'graphql';
import { Request, Response } from 'express';

import { loginUser, logoutUser, changePasswordForUser } from '../../database/update/auth';
import { LoginInputType, ChangePwInputType, PersonType } from '../types';

export default {
  login: {
    type: PersonType,
    args: { input: { type: new GraphQLNonNull(LoginInputType) } },
    resolve: async (root: any, args: any, context: any) => {
      const res: Response = (await context).response;
      const data = await loginUser(args.input.name, args.input.password);
      if (data.user && data.sessionId) {
        //  if token was generated add http cookie
        res.cookie('session_token', data.sessionId);
        // return user which is now logged in
        return data.user;
      } else {
        // user was not found or password did not match
        return null;
      }
    }
  },
  logout: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: async (root: any, args: any, context: any) => {
      const res: Response = (await context).response;
      const req: Request = (await context).request;
      if (logoutUser(args._id, req.cookies.session_token)) {
        // if user was logged out delete the sessionId from the cookie
        res.cookie('session_token', '', { maxAge: -1 });
        return true;
      } else {
        // if user could not be logged out do not delete the sessionId cookie
        return false;
      }
    }
  },
  changePw: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: { input: { type: new GraphQLNonNull(ChangePwInputType) } },
    resolve: async (root: any, args: any, context: any) => {
      const req: Request = (await context).request;
      const auth: number = (await context).authLevel;
      // try to change the password
      return changePasswordForUser(args.input._id, args.input.password, req.cookies.session_token, auth);
    }
  }
};
