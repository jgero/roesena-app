import { arrayToMap, mapToArray } from './map-array-general';
import { DocumentSnapshot, QueryDocumentSnapshot, DocumentChangeAction, Action } from '@angular/fire/firestore/interfaces';
import { StoreableArticle, AppArticle } from '@utils/interfaces';
import * as fbs from 'firebase/app';

export function toStorableArticle(app: AppArticle): StoreableArticle {
  const { title, content, ownerId, ownerName } = app;
  return {
    title,
    content,
    ownerId,
    ownerName,
    tags: arrayToMap(app.tags),
    created: fbs.firestore.Timestamp.fromDate(app.created),
  };
}

export function convertOne(a: Action<DocumentSnapshot<StoreableArticle>>): AppArticle | null {
  return convertSnapshot(a.payload);
}

export function convertMany(action: DocumentChangeAction<StoreableArticle>[]): AppArticle[] {
  // convert all snapshots to data
  let result = action.map((a) => convertSnapshot(a.payload.doc));
  // filter out the 'null' elements if there are some
  result = result.filter((val) => !!val);
  return result;
}

export function convertSnapshot(
  snapshot: DocumentSnapshot<StoreableArticle> | QueryDocumentSnapshot<StoreableArticle>
): AppArticle | null {
  if (!snapshot.data()) {
    return null;
  }
  const { title, ownerId, content, ownerName } = snapshot.data();
  return {
    title,
    ownerId,
    ownerName,
    content,
    id: snapshot.id,
    tags: mapToArray(snapshot.data().tags),
    created: snapshot.data().created.toDate(),
  };
}
