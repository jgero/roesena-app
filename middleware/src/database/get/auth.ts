import { ConnectionProvider } from '../connection';
import { Person } from '../../interfaces';

export async function getPersonBySessionId(sessionId: string): Promise<Person | null> {
  // return Person data if a session exists
  if (sessionId) {
    const collection = (await ConnectionProvider.Instance.db).collection('persons');
    return await collection.findOne<Person>({ sessionId });
  } else {
    return null;
  }
}
