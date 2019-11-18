import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { ObjectID } from 'bson';

import { Person } from '../../interfaces';
import { ConnectionProvider } from '../connection';

export async function loginUser(name: string, queryPassword: string): Promise<{ user: Person | null; sessionId: string }> {
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  const userToLogin = await collection.findOne({ name });
  // return nothing if name does not match
  if (!userToLogin) {
    return { user: null, sessionId: '' };
  }
  // compare password from the query to the password in the database
  if (await compare(queryPassword, userToLogin.password)) {
    // generate random session id
    const session = randomBytes(16).toString('base64');
    // set the session id in the database
    await collection.updateOne({ name }, { $set: { sessionId: session } });
    // return the person without the password
    delete userToLogin.password;
    return { user: userToLogin, sessionId: session };
  } else {
    // password does not match
    return { user: null, sessionId: '' };
  }
}

export async function logoutUser(id: string, sessionId: string): Promise<boolean> {
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  // remove sessionId in the database
  const result = await collection.updateOne({ _id: new ObjectID(id), sessionId }, { $unset: { sessionId: '' } });
  // return whether the sessionId was removed or not
  return result.modifiedCount === 1;
}

export async function changePasswordForUser(
  userIdToChangePassword: string,
  password: string,
  sessionId: string,
  auth: number
): Promise<boolean> {
  const collection = (await ConnectionProvider.Instance.db).collection('persons');
  // get the acting user
  const actingUser = await collection.findOne({ sessionId });
  // password can only be changed if it's your own or an admin is doing the action
  if ((actingUser && actingUser._id === userIdToChangePassword) || auth === 5) {
    const result = await collection.updateOne(
      { _id: new ObjectID(userIdToChangePassword) },
      { $set: { password: await hash(password, 10) } }
    );
    return result.modifiedCount === 1;
  } else {
    return false;
  }
}
