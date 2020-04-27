import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import {
  DocumentSnapshot,
  Action,
  DocumentChangeAction,
  QueryDocumentSnapshot,
  CollectionReference,
  Query,
} from "@angular/fire/firestore/interfaces";
import { Observable, of, from } from "rxjs";
import { tap, catchError, map, switchMap } from "rxjs/operators";
import * as fbs from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

import { appImage, appElementDAL, paginatedDAL } from "src/app/utils/interfaces";
import { arrayToMap, mapToArray } from "src/app/utils/converters";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Direction } from "src/app/utils/enums";

interface storeableImage {
  ownerId: string;
  ownerName: string;
  created: fbs.firestore.Timestamp;
  tags: { [key: string]: boolean };
}

@Injectable({
  providedIn: "root",
})
export class ImageDalService implements paginatedDAL {
  private pageFirst: QueryDocumentSnapshot<storeableImage>;
  private pageLast: QueryDocumentSnapshot<storeableImage>;
  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, private snackbar: MatSnackBar) {}

  getAll(): Observable<appImage[]> {
    return this.firestore
      .collection<storeableImage>("images")
      .snapshotChanges()
      .pipe(
        map(convertMany),
        catchError((err) => {
          this.snackbar.open(`Bilder konnten nicht geladen werden: ${err}`, "OK");
          return of([]);
        })
      );
  }

  getDocCount(): Observable<number> {
    return this.firestore
      .collection("meta")
      .doc("images")
      .snapshotChanges()
      .pipe(
        map((el) => (el.payload.data() as { amount: number }).amount),
        catchError((err) => {
          this.snackbar.open(`Fehler beim laden der Bilderzahl: ${err}`, "OK");
          return of(0);
        })
      );
  }

  getPage(limit: number, dir: Direction): Observable<appImage[]> {
    return this.firestore
      .collection<storeableImage>("images", (qFn) => {
        let query: CollectionReference | Query = qFn;
        // always order by creation date
        query = query.orderBy("created", "desc");
        // paginate the data
        switch (dir) {
          case Direction.initial:
            query = query.limit(limit);
            break;
          case Direction.forward:
            query = query.startAfter(this.pageLast).limit(limit);
            break;
          case Direction.back:
            query = query.endBefore(this.pageFirst).limitToLast(limit);
            break;
        }
        return query;
      })
      .snapshotChanges()
      .pipe(
        tap((el) => {
          if (el.length === 0) throw new Error("empty result");
          this.pageFirst = el[0].payload.doc;
          this.pageLast = el[el.length - 1].payload.doc;
        }),
        map(convertMany),
        catchError((err) => {
          this.snackbar.open(`Fehler beim laden von Bildern: ${err}`, "OK");
          return of([]);
        })
      );
  }

  getByTags(tags: string[], limit?: number): Observable<appImage[]> {
    return this.firestore
      .collection<storeableImage>("images", (qFn) => {
        let query: CollectionReference | Query = qFn;
        tags.forEach((tag) => {
          query = query.where(`tags.${tag}`, "==", true);
        });
        if (limit) {
          query = query.limit(limit);
        }
        return query;
      })
      .snapshotChanges()
      .pipe(
        map(convertMany),
        catchError((err) => {
          this.snackbar.open(`Bilder konnten nicht geladen werden: ${err}`, "OK");
          return of([]);
        })
      );
  }

  getById(id: string): Observable<appImage | null> {
    return this.firestore
      .collection<storeableImage>("images")
      .doc<storeableImage>(id)
      .snapshotChanges()
      .pipe(
        map(convertOne),
        catchError((err) => {
          this.snackbar.open(`Bild konnte nicht geladen werden: ${err}`, "OK");
          return of(null);
        })
      );
  }

  getDownloadURL(id: string): Observable<string | null> {
    return this.storage
      .ref("uploads")
      .child(`${id}_cropped`)
      .getDownloadURL()
      .pipe(
        catchError(() => {
          // image may not be resized yet, function could still be running
          return this.storage
            .ref("uploads")
            .child(id)
            .getDownloadURL()
            .pipe(
              catchError((err) => {
                // image does not exist
                this.snackbar.open(`Bild URL konnte nicht geladen werden: ${err}`, "OK");
                return of(null);
              })
            );
        })
      );
  }

  insert(img: appImage, file: string): Observable<string | null> {
    let id: string;
    return from(this.firestore.collection<storeableImage>("images").add(toStorableImage(img))).pipe(
      tap((docRef) => (id = docRef.id)),
      switchMap((docRef) => this.storage.ref(`uploads/${docRef.id}`).putString(file, "data_url")),
      map(() => id),
      tap(() => {
        this.snackbar.open(`Gespeichert!`, "OK", { duration: 2000 });
      }),
      catchError((err) => {
        this.snackbar.open(`Bild konnte nicht hinzugefügt werden: ${err}`, "OK");
        return of(null);
      })
    );
  }

  update(img: appImage, file: string): Observable<boolean> {
    return from(
      this.firestore.collection<storeableImage>("images").doc<storeableImage>(img.id).update(toStorableImage(img))
    ).pipe(
      switchMap(() => (file ? this.storage.ref(`uploads/${img.id}`).putString(file, "data_url") : of(true))),
      map(() => true),
      tap(() => {
        this.snackbar.open(`Gespeichert!`, "OK", { duration: 2000 });
      }),
      catchError((err) => {
        this.snackbar.open(`Bild konnte nicht bearbeitet werden: ${err}`, "OK");
        return of(false);
      })
    );
  }

  delete(id: string): Observable<boolean> {
    return from(this.firestore.collection<storeableImage>("images").doc<storeableImage>(id).delete()).pipe(
      map(() => true),
      tap(() => {
        this.snackbar.open(`Gelöscht!`, "OK", { duration: 2000 });
      }),
      catchError((err) => {
        this.snackbar.open(`Bild konnte nicht gelöscht werden: ${err}`, "OK");
        return of(false);
      })
    );
  }
}

function toStorableImage(app: appImage): storeableImage {
  const { ownerId, ownerName } = app;
  return {
    ownerId,
    ownerName,
    tags: arrayToMap(app.tags),
    created: fbs.firestore.Timestamp.fromDate(app.created),
  };
}

function convertOne(action: Action<DocumentSnapshot<storeableImage>>): appImage | null {
  return convertSnapshot(action.payload);
}

function convertMany(action: DocumentChangeAction<storeableImage>[]): appImage[] {
  // convert all snapshots to data
  let result = action.map((action) => convertSnapshot(action.payload.doc));
  // filter out the 'null' elements if there are some
  result = result.filter((val) => !!val);
  return result;
}

function convertSnapshot(snapshot: DocumentSnapshot<storeableImage> | QueryDocumentSnapshot<storeableImage>): appImage | null {
  if (!snapshot.data()) return null;
  const { ownerId, ownerName } = snapshot.data();
  return {
    ownerId,
    ownerName,
    id: snapshot.id,
    tags: mapToArray(snapshot.data().tags),
    created: snapshot.data().created.toDate(),
  };
}
