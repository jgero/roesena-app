import { Request, Response } from "express";
import { compare, hash } from "bcrypt";
import { randomBytes } from "crypto";
import { ObjectID } from "bson";

import { Person, PersonWithPassword } from "../interfaces";
import { ConnectionProvider } from "../connection";

export async function me(_args: any, context: any): Promise<Person | null> {
  const req: Request = (await context).request;
  // user has to be logged in to get person data
  if (req.cookies.session_token) {
    const collection = (await ConnectionProvider.Instance.db).collection("persons");
    return await collection.findOne<Person>({ sessionId: req.cookies.session_token });
  } else {
    return null;
  }
}

export async function login({ password, name }: { password: string, name: string }, context: any): Promise<Person | null> {
  const res: Response = (await context).response;
  const collection = (await ConnectionProvider.Instance.db).collection("persons");
  const toLogIn = await collection.findOne<PersonWithPassword>({ name: name });
  // return nothing if username does not match
  if (!toLogIn) { return null }
  // compare the query password an the one from the db
  if (await compare(password, toLogIn.password)) {
    // generate random session id
    const session = randomBytes(16).toString('base64');
    // set the session id in the database
    await collection.updateOne({ name: name }, { $set: { sessionId: session } });
    // set the cookie on the response
    res.cookie("session_token", session);
    // return the person without the password
    delete toLogIn.password;
    return toLogIn;
  } else {
    // password does not match
    return null;
  }
}

export async function logout({ _id }: { _id: string }, context: any): Promise<boolean> {
  const res: Response = (await context).response;
  const req: Request = (await context).request;
  const collection = (await ConnectionProvider.Instance.db).collection("persons");
  // unset the session id in the database
  const result = await collection.updateOne({ _id: new ObjectID(_id), sessionId: req.cookies.session_token }, { $unset: { sessionId: '' } });
  // return if the logout worked or not
  if (result.modifiedCount === 1) {
    // remove the cookie
    res.cookie("session_token", "", { maxAge: -1 });
    return true;
  } else {
    return false;
  }
}

export async function changePw({ _id, newPassword }: { _id: string, newPassword: string }, context: any): Promise<boolean> {
  const req: Request = (await context).request;
  const authLevel: number = (await context).authLevel;
  const collection = (await ConnectionProvider.Instance.db).collection("persons");
  // get the acting user
  const actingUser = await collection.findOne<Person>({ sessionId: req.cookies.session_token });
  // password can only be changed if it's your own or an admin is doing the action
  if (actingUser && actingUser._id === _id || authLevel === 5) {
    const result = await collection.updateOne({ _id: new ObjectID(_id) }, { $set: { password: await hash(newPassword, 10) } });
    return result.modifiedCount === 1;
  } else {
    return false;
  }
}
