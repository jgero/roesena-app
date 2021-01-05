import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const createUser = functions
  .region('europe-west1')
  .auth.user()
  .onCreate((user) => {
    return admin.firestore().collection('persons').doc(user.uid).set({ isConfirmedMember: false, name: user.email, groups: {} });
  });

export const deleteUser = functions
  .region('europe-west1')
  .auth.user()
  .onDelete((user) => {
    return admin.firestore().collection('persons').doc(user.uid).delete();
  });

export const personWriteListener = functions
  .region('europe-west1')
  .firestore.document('persons/{personId}')
  .onWrite(async (change, context) => {
    if (!change.before.exists) {
      // New document Created : add one to count
      return admin
        .firestore()
        .collection('meta')
        .doc('persons')
        .update({ amount: admin.firestore.FieldValue.increment(1) });
    } else if (change.before.exists && change.after.exists) {
      // Updating existing document : update denormalized names if names changed
      const before = change.before.data();
      const after = change.after.data();
      const uid = context.params.personId;
      if (after && before && before.name !== after.name) {
        // cutoff date is one year before the current date
        const cutoffDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
        const writeOps: Promise<any>[] = [];
        // update article owner names
        writeOps.push(
          ...(
            await admin
              .firestore()
              .collection('articles')
              // only articles where current user is owner
              .where('ownerId', '==', uid)
              // and only when the article was created after the cutoff date
              .where('created', '>=', cutoffDate)
              .get()
          ).docs.map((personDoc) => admin.firestore().collection('articles').doc(personDoc.id).update({ ownerName: after.name }))
        );
        // update image owner names
        writeOps.push(
          ...(
            await admin
              .firestore()
              .collection('images')
              // only images where current user is owner
              .where('ownerId', '==', uid)
              // and only if image was crated after the cutoff date
              .where('created', '>=', cutoffDate)
              .get()
          ).docs.map((imageDoc) => admin.firestore().collection('images').doc(imageDoc.id).update({ ownerName: after.name }))
        );
        // update event owner names
        writeOps.push(
          ...(
            await admin
              .firestore()
              .collection('events')
              // only events where current user is owner
              .where('ownerId', '==', uid)
              // and only if event was after the cutoff date
              .where('startDate', '>=', cutoffDate)
              .get()
          ).docs.map((eventDoc) => admin.firestore().collection('events').doc(eventDoc.id).update({ ownerName: after.name }))
        );
        // update participant name in events
        writeOps.push(
          ...(
            await admin
              .firestore()
              .collection('events')
              // only events where current user is participant
              .where(`participants.${uid}.amount`, '>=', -1)
              // and only if event was after the cutoff date
              .where('startDate', '>=', cutoffDate)
              .get()
          ).docs.map((eventDoc) =>
            admin
              .firestore()
              .collection('events')
              .doc(eventDoc.id)
              .update({ [`participants.${uid}.name`]: after.name })
          )
        );
        return Promise.all(writeOps);
      }
    } else if (!change.after.exists) {
      const writeOps: Promise<any>[] = [];
      // Deleting document : subtract one from count
      writeOps.push(
        admin
          .firestore()
          .collection('meta')
          .doc('persons')
          .update({ amount: admin.firestore.FieldValue.increment(-1) })
      );
      // delete person from all events as participant
      writeOps.push(
        ...(
          await admin.firestore().collection('events').where(`participants.${change.before.id}.amount`, '>=', -1).get()
        ).docs.map((eventDoc) =>
          admin
            .firestore()
            .collection('events')
            .doc(eventDoc.id)
            .update({ [`participants.${change.before.id}`]: admin.firestore.FieldValue.delete() })
        )
      );
      return Promise.all(writeOps);
    }
    return false;
  });
