import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  DocumentSnapshot,
  Action,
  DocumentChangeAction,
  QueryDocumentSnapshot,
  CollectionReference,
  Query,
} from "@angular/fire/firestore";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, of, from } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";
import * as fbs from "firebase/app";
import "firebase/firestore";

import { appArticle, paginatedDAL } from "src/app/utils/interfaces";
import { arrayToMap, mapToArray } from "src/app/utils/converters";
import { Direction } from "src/app/utils/enums";

interface storeableArticle {
  ownerId: string;
  ownerName: string;
  created: fbs.firestore.Timestamp;
  title: string;
  content: string;
  tags: { [key: string]: boolean };
}

@Injectable({
  providedIn: "root",
})
export class ArticleDalService implements paginatedDAL {
  private pageFirst: QueryDocumentSnapshot<storeableArticle>;
  private pageLast: QueryDocumentSnapshot<storeableArticle>;
  constructor(private firestore: AngularFirestore, private snackbar: MatSnackBar) {}

  getById(id: string): Observable<appArticle | null> {
    return this.firestore
      .collection<storeableArticle>("articles")
      .doc<storeableArticle>(id)
      .snapshotChanges()
      .pipe(
        map(convertOne),
        catchError((err) => {
          this.snackbar.open(`Artikel konnte nicht geladen werden: ${err}`, "OK");
          return of(null);
        })
      );
  }

  getBySearchStrings(tags: string[], limit?: number): Observable<appArticle[]> {
    // if there is no limit set one
    if (!limit) {
      limit = 15;
    }
    // check if limit is too big
    if (limit && (limit < 1 || limit > 20)) {
      this.snackbar.open(`Limit '${limit}' ist ungültig in Artikel Query`, "OK");
      return of([]);
    }
    return this.firestore
      .collection<storeableArticle>("articles", (qFn) => {
        let query: CollectionReference | Query = qFn;
        query = query.limit(limit);
        tags.forEach((tag) => {
          query = query.where(`tags.${tag}`, "==", true);
        });
        return query;
      })
      .snapshotChanges()
      .pipe(
        map(convertMany),
        catchError((err) => {
          this.snackbar.open(`Artikel konnten nicht geladen werden: ${err}`, "OK");
          return of([]);
        })
      );
  }

  getDocCount(): Observable<number> {
    return this.firestore
      .collection("meta")
      .doc("articles")
      .snapshotChanges()
      .pipe(
        map((el) => (el.payload.data() as { amount: number }).amount),
        catchError((err) => {
          this.snackbar.open(`Fehler beim laden der Artikelzahl: ${err}`, "OK");
          return of(0);
        })
      );
  }

  getAll(limit?: number): Observable<appArticle[]> {
    return this.firestore
      .collection<storeableArticle>("articles", (qFn) => {
        let query: CollectionReference | Query = qFn;
        // always order by creation date
        query = query.orderBy("created", "desc");
        if (limit) {
          query = query.limit(limit);
        }
        return query;
      })
      .snapshotChanges()
      .pipe(
        map(convertMany),
        catchError((err) => {
          this.snackbar.open(`Fehler beim laden von Artikeln: ${err}`, "OK");
          return of([]);
        })
      );
  }

  getPage(limit: number, dir: Direction): Observable<appArticle[]> {
    return this.firestore
      .collection<storeableArticle>("articles", (qFn) => {
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
          this.snackbar.open(`Fehler beim laden von Artikeln: ${err}`, "OK");
          return of([]);
        })
      );
  }

  insert(article: appArticle): Observable<string | null> {
    return from(this.firestore.collection("articles").add(toStorableArticle(article))).pipe(
      map((el) => el.id),
      tap(() => {
        this.snackbar.open(`Gespeichert!`, "OK", { duration: 2000 });
      }),
      catchError((err) => {
        this.snackbar.open(`Artikel konnte nicht hinzugefügt werden: ${err}`, "OK");
        return of(null);
      })
    );
  }

  update(updated: appArticle): Observable<boolean> {
    return from(this.firestore.collection("articles").doc(updated.id).update(toStorableArticle(updated))).pipe(
      map(() => true),
      tap(() => {
        this.snackbar.open(`Gespeichert!`, "OK", { duration: 2000 });
      }),
      catchError((err) => {
        this.snackbar.open(`Artikel konnte nicht gespeichert werden: ${err}`, "OK");
        return of(false);
      })
    );
  }

  delete(id: string): Observable<boolean> {
    return from(this.firestore.collection("articles").doc(id).delete()).pipe(
      map(() => true),
      tap(() => {
        this.snackbar.open(`Gelöscht!`, "OK", { duration: 2000 });
      }),
      catchError((err) => {
        this.snackbar.open(`Artikel konnte nicht gelöscht werden: ${err}`, "OK");
        return of(false);
      })
    );
  }
}

function toStorableArticle(app: appArticle): storeableArticle {
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

function convertOne(action: Action<DocumentSnapshot<storeableArticle>>): appArticle | null {
  return convertSnapshot(action.payload);
}

function convertMany(action: DocumentChangeAction<storeableArticle>[]): appArticle[] {
  // convert all snapshots to data
  let result = action.map((action) => convertSnapshot(action.payload.doc));
  // filter out the 'null' elements if there are some
  result = result.filter((val) => !!val);
  return result;
}

function convertSnapshot(
  snapshot: DocumentSnapshot<storeableArticle> | QueryDocumentSnapshot<storeableArticle>
): appArticle | null {
  if (!snapshot.data()) return null;
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
