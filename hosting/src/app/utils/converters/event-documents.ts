import { AppEvent, StoreableEvent } from '@utils/interfaces';
import * as fbs from 'firebase/app';
import { arrayToMap, mapToArray } from './map-array-general';
import { participantArrayToMap, participantMapToArray } from './participants';
import { Action, DocumentSnapshot, DocumentChangeAction, QueryDocumentSnapshot } from '@angular/fire/firestore/interfaces';

export function toStorableEvent(app: AppEvent): StoreableEvent {
  const { title, description, ownerId, ownerName, date } = app;
  return {
    title,
    description,
    ownerId,
    ownerName,
    startDate: fbs.firestore.Timestamp.fromDate(app.date),
    tags: arrayToMap(app.tags),
    deadline: app.deadline ? fbs.firestore.Timestamp.fromDate(app.deadline) : null,
    participants: participantArrayToMap(app.participants),
  };
}

export function convertOne(action: Action<DocumentSnapshot<StoreableEvent>>): AppEvent | null {
  return convertSnapshot(action.payload);
}

export function convertMany(action: DocumentChangeAction<StoreableEvent>[]): AppEvent[] {
  // convert all snapshots to data
  let result = action.map((a) => convertSnapshot(a.payload.doc));
  // filter out the 'null' elements if there are some
  result = result.filter((val) => !!val);
  return result;
}

function convertSnapshot(snapshot: DocumentSnapshot<StoreableEvent> | QueryDocumentSnapshot<StoreableEvent>): AppEvent | null {
  if (!snapshot.data()) {
    return null;
  }
  const { title, description, ownerId, ownerName } = snapshot.data();
  return {
    title,
    description,
    ownerId,
    ownerName,
    id: snapshot.id,
    date: new Date(snapshot.data().startDate.toDate()),
    deadline: snapshot.data().deadline ? new Date(snapshot.data().deadline.toDate()) : null,
    tags: mapToArray(snapshot.data().tags),
    participants: participantMapToArray(snapshot.data().participants),
  };
}
