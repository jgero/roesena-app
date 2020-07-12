import * as express from 'express';
import * as admin from 'firebase-admin';

/**
 * checks the firebase id token, responds with error if not authenticated
 *
 * also sets req.uid as the id of the currently logged in person
 */
export const validateFirebaseIdToken: express.RequestHandler = async (req, res, next) => {
  // no session cookie or bearer token found
  if (
    (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
    !(req.cookies && req.cookies.__session)
  ) {
    res.status(403).send({ error: 'Unauthorized' });
    return;
  }

  let idToken: string;
  // check for auth header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
    // check for session cookie
  } else if (req.cookies) {
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie or header
    res.status(403).send({ error: 'Unauthorized' });
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    // append uid to request and pass to next middleware
    (req as any).uid = decodedIdToken.uid;
    next();
    return;
  } catch (error) {
    // could not verify id token
    res.status(403).send({ error: 'Unauthorized' });
    return;
  }
};
