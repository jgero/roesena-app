import { Injectable } from "@angular/core";
import { AngularFirestore, QuerySnapshot, DocumentData, DocumentSnapshot } from "@angular/fire/firestore";
import { Observable, of, from } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";
import "firebase/firestore";

import { appArticle } from "src/app/utils/interfaces";
import { TracingStateService } from "../tracing-state.service";
import { AuthService } from "../auth.service";
import { tagMapToArray, tagArrayToMap } from "src/app/utils/tag-converters";

@Injectable({
  providedIn: "root"
})
export class ArticleDalService {
  constructor(private trace: TracingStateService, private firestore: AngularFirestore, private auth: AuthService) {}

  getArticles(): Observable<appArticle[]> {
    this.trace.addLoading();
    return this.firestore
      .collection<appArticle>("articles")
      .get()
      .pipe(
        map(convertArticlesFromDocuments),
        tap(() => {
          this.trace.completeLoading();
        }),
        catchError(err => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Artikel konnten nicht geladen werden: ${err}`);
          return of([]);
        })
      );
  }

  getArticleById(id: string): Observable<appArticle> {
    this.trace.addLoading();
    return this.firestore
      .collection<appArticle>("articles")
      .doc(id)
      .get()
      .pipe(
        map(convertArticleFromDocument),
        tap(() => {
          this.trace.completeLoading();
        }),
        catchError(err => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Artikel konnte nicht geladen werden: ${err}`);
          return of(null);
        })
      );
  }

  getLatestArticles(): Observable<appArticle[]> {
    this.trace.addLoading();
    return this.firestore
      .collection("articles", qFn => qFn.orderBy("created", "desc").limit(3))
      .get()
      .pipe(
        map(convertArticlesFromDocuments),
        tap(() => {
          this.trace.completeLoading();
        }),
        catchError(err => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Artikel konnten nicht geladen werden: ${err}`);
          return of([]);
        })
      );
  }

  insert(article: appArticle): Observable<boolean> {
    this.trace.addLoading();
    delete article.id;
    article.ownerId = this.auth.$user.getValue().id;
    article.created = new Date();
    (article.tags as any) = tagArrayToMap(article.tags);
    return from(this.firestore.collection("articles").add(article)).pipe(
      map(() => true),
      tap(() => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Gespeichert!`);
      }),
      catchError(err => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Artikel konnte nicht hinzugefügt werden: ${err}`);
        return of(false);
      })
    );
  }

  update(updated: appArticle): Observable<boolean> {
    this.trace.addLoading();
    const id = updated.id;
    delete updated.id;
    (updated.tags as any) = tagArrayToMap(updated.tags);
    return from(
      this.firestore
        .collection("articles")
        .doc(id)
        .update(updated)
    ).pipe(
      map(() => true),
      tap(() => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Gespeichert!`);
      }),
      catchError(err => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Artikel konnte nicht gespeichert werden: ${err}`);
        return of(false);
      })
    );
  }

  delete(id: string): Observable<boolean> {
    this.trace.addLoading();
    return from(
      this.firestore
        .collection("articles")
        .doc(id)
        .delete()
    ).pipe(
      map(() => true),
      tap(() => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Gelöscht!`);
      }),
      catchError(err => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Artikel konnte nicht gelöscht werden: ${err}`);
        return of(false);
      })
    );
  }
}

function convertArticlesFromDocuments(snapshot: QuerySnapshot<DocumentData[]>): appArticle[] {
  let data: any[] = snapshot.docs.map(doc => {
    let data: any = doc.data();
    data.id = doc.id;
    data.created = new Date(data.created.toDate());
    data.tags = tagMapToArray(data.tags);
    return data;
  });
  return data;
}

function convertArticleFromDocument(doc: DocumentSnapshot<DocumentData>): appArticle {
  let data: any = doc.data();
  data.id = doc.id;
  data.created = new Date(data.created.toDate());
  data.tags = tagMapToArray(data.tags);
  return data;
}
