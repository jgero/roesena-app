import { AppPerson, StoreablePerson } from '@utils/interfaces';
import { Action, DocumentSnapshot, DocumentChangeAction, QueryDocumentSnapshot } from '@angular/fire/firestore/interfaces';
import { arrayToMap, mapToArray } from './map-array-general';

export function toStorablePerson(app: AppPerson): StoreablePerson {
  const { isConfirmedMember, name } = app;
  return {
    isConfirmedMember,
    name,
    groups: arrayToMap(app.groups),
  };
}

export function convertOne(action: Action<DocumentSnapshot<StoreablePerson>>): AppPerson | null {
  return convertSnapshot(action.payload);
}

export function convertMany(action: DocumentChangeAction<StoreablePerson>[]): AppPerson[] {
  // convert all snapshots to data
  let result = action.map((a) => convertSnapshot(a.payload.doc));
  // filter out the 'null' elements if there are some
  result = result.filter((val) => !!val);
  return result;
}

export function convertSnapshot(
  snapshot: DocumentSnapshot<StoreablePerson> | QueryDocumentSnapshot<StoreablePerson>
): AppPerson | null {
  if (!snapshot.data()) {
    return null;
  }
  const { isConfirmedMember, name } = snapshot.data();
  return {
    isConfirmedMember,
    name,
    id: snapshot.id,
    groups: mapToArray(snapshot.data().groups),
  };
}
