import { arrayToMap, mapToArray } from './map-array-general';
import { AppImage, StoreableImage } from '@utils/interfaces';
import { DocumentSnapshot, Action, DocumentChangeAction, QueryDocumentSnapshot } from '@angular/fire/firestore/interfaces';
import * as fbs from 'firebase/app';

export function toStorableImage(app: AppImage): StoreableImage {
  const { ownerId, ownerName } = app;
  return {
    ownerId,
    ownerName,
    tags: arrayToMap(app.tags),
    created: fbs.firestore.Timestamp.fromDate(app.created),
  };
}

export function convertOne(action: Action<DocumentSnapshot<StoreableImage>>): AppImage | null {
  return convertSnapshot(action.payload);
}

export function convertMany(action: DocumentChangeAction<StoreableImage>[]): AppImage[] {
  // convert all snapshots to data
  let result = action.map((a) => convertSnapshot(a.payload.doc));
  // filter out the 'null' elements if there are some
  result = result.filter((val) => !!val);
  return result;
}

export function convertSnapshot(
  snapshot: DocumentSnapshot<StoreableImage> | QueryDocumentSnapshot<StoreableImage>
): AppImage | null {
  if (!snapshot.data()) {
    return null;
  }
  const { ownerId, ownerName } = snapshot.data();
  return {
    ownerId,
    ownerName,
    id: snapshot.id,
    tags: mapToArray(snapshot.data().tags),
    created: snapshot.data().created.toDate(),
  };
}
