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
import { Observable, of, from } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";
import * as fbs from "firebase/app";
import "firebase/firestore";

import { appArticle, appElementDAL } from "src/app/utils/interfaces";
import { AuthService } from "../auth.service";
import { arrayToMap, mapToArray } from "src/app/utils/converters";
import { MatSnackBar } from "@angular/material/snack-bar";

interface storeableArticle {
  ownerId: string;
  created: fbs.firestore.Timestamp;
  title: string;
  content: string;
  tags: { [key: string]: boolean };
}

@Injectable({
  providedIn: "root",
})
export class ArticleDalService implements appElementDAL {
  constructor(private firestore: AngularFirestore, private auth: AuthService, private snackbar: MatSnackBar) {}

  getArticleById(id: string): Observable<appArticle | null> {
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

  getByTags(tags: string[]): Observable<appArticle[]> {
    return this.firestore
      .collection<storeableArticle>("articles", (qFn) => {
        let query: CollectionReference | Query = qFn;
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

  getAll(limit?: number): Observable<appArticle[]> {
    return this.firestore
      .collection<storeableArticle>("articles", (qFn) => {
        let query: CollectionReference | Query = qFn;
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
          this.snackbar.open(`Artikel konnten nicht geladen werden: ${err}`, "OK");
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
  const { title, content, ownerId } = app;
  return {
    title,
    content,
    ownerId,
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
  const { title, ownerId, content } = snapshot.data();
  return {
    title,
    ownerId,
    content,
    id: snapshot.id,
    tags: mapToArray(snapshot.data().tags),
    created: snapshot.data().created.toDate(),
  };
}
