import { Injectable } from "@angular/core";
import { AngularFirestore, QuerySnapshot, DocumentData } from "@angular/fire/firestore";
import { Observable, of } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";
import "firebase/firestore";

import { appArticle } from "src/app/utils/interfaces";
import { TracingStateService } from "../tracing-state.service";

@Injectable({
  providedIn: "root"
})
export class ArticleDalService {
  constructor(private trace: TracingStateService, private firestore: AngularFirestore) {}

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
}

function convertArticlesFromDocuments(snapshot: QuerySnapshot<DocumentData[]>): appArticle[] {
  let data: any[] = snapshot.docs.map(doc => {
    let data: any = doc.data();
    data.id = doc.id;
    data.created = new Date(data.created.toDate());
    return data;
  });
  return data;
}
