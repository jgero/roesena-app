import { Request, Response } from 'express';
import { GraphQLID, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { ObjectID } from 'bson';

import { ConnectionProvider } from '../connection';
import { PersonType } from '../person/types';
import { LoginInputType, ChangePwInputType } from './types';

export const authMutations = {
  login: {
    type: PersonType,
    args: { input: { type: new GraphQLNonNull(LoginInputType) } },
    resolve: login
  },
  logout: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: logout
  },
  changePw: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: { input: { type: new GraphQLNonNull(ChangePwInputType) } },
    resolve: changePw
  }
};

async function login(_: any, args: any, context: any) {
  const { name, password } = args.input;
  const res: Response = (await context).response;
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  const toLogIn = await collection.findOne({ name: name });
  // return nothing if username does not match
  if (!toLogIn) {
    return null;
  }
  // compare the query password an the one from the db
  if (await compare(password, toLogIn.password)) {
    // generate random session id
    const session = randomBytes(16).toString('base64');
    // set the session id in the database
    await collection.updateOne({ name }, { $set: { sessionId: session } });
    // set the cookie on the response
    res.cookie('session_token', session);
    // return the person without the password
    delete toLogIn.password;
    return toLogIn;
  } else {
    // password does not match
    return null;
  }
}

async function logout(_: any, args: any, context: any): Promise<boolean> {
  const _id = args._id;
  const res: Response = (await context).response;
  const req: Request = (await context).request;
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  // unset the session id in the database
  const result = await collection.updateOne(
    { _id: new ObjectID(_id), sessionId: req.cookies.session_token },
    { $unset: { sessionId: '' } }
  );
  // return if the logout worked or not
  if (result.modifiedCount === 1) {
    // remove the cookie
    res.cookie('session_token', '', { maxAge: -1 });
    return true;
  } else {
    return false;
  }
}

async function changePw(_: any, args: any, context: any): Promise<boolean> {
  const { _id, password } = args.input;
  const req: Request = (await context).request;
  const authLevel: number = (await context).authLevel;
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  // get the acting user
  const actingUser = await collection.findOne({ sessionId: req.cookies.session_token });
  // password can only be changed if it's your own or an admin is doing the action
  if ((actingUser && actingUser._id === _id) || authLevel === 5) {
    const result = await collection.updateOne({ _id: new ObjectID(_id) }, { $set: { password: await hash(password, 10) } });
    return result.modifiedCount === 1;
  } else {
    return false;
  }
}
