import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  CollectionReference,
  Query,
  DocumentChangeAction,
  QueryDocumentSnapshot,
  DocumentSnapshot,
} from '@angular/fire/firestore/interfaces';
import { Store } from '@ngrx/store';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, merge, Observable } from 'rxjs';
import { map, withLatestFrom, filter, switchMap } from 'rxjs/operators';
import 'firebase/firestore';

import * as articleOverveiwActions from '../actions/article-overview.actions';
import { AppStore } from '../reducers';
import { StoreableArticle, AppArticle } from 'src/app/utils/interfaces';
import { mapToArray } from '../utils/converters';

enum LoadMode {
  forward,
  backwards,
  init,
}

@Injectable()
export class ArticleOverviewEffects {
  initPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      withLatestFrom(this.store),
      filter(([action, storeState]) => (storeState.router.state.url as string).includes('/articles/overview')),
      switchMap(([action, storeState]) => this.getDocumentStream(storeState, LoadMode.init))
    )
  );
  pageForward$ = createEffect(() =>
    this.actions$.pipe(
      ofType(articleOverveiwActions.pageForward),
      withLatestFrom(this.store),
      switchMap(([action, storeState]) => this.getDocumentStream(storeState, LoadMode.forward))
    )
  );
  pageBackwards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(articleOverveiwActions.pageBackwards),
      withLatestFrom(this.store),
      switchMap(([action, storeState]) => this.getDocumentStream(storeState, LoadMode.backwards).pipe())
    )
  );

  private getDocumentStream(storeState: AppStore, direction: LoadMode): Observable<any> {
    return this.firestore
      .collection<StoreableArticle>('articles', (qFn) => {
        let query: CollectionReference | Query = qFn;
        // paginate the data
        switch (direction) {
          case LoadMode.init:
            if (storeState.search.searchStrings.length > 0) {
              // add search constraints if there are some
              storeState.search.searchStrings.forEach((searchString) => {
                query = query.where(`tags.${searchString}`, '==', true);
              });
            } else {
              // sort the data for pagination if there are no search stirngs
              // both at the same time is not possible, because that would require composite indexes between
              // the search string combination and the date
              query = query.orderBy('created', 'desc');
            }
            // the limit applies in both cases to avoid page getting too slow and do unnecessary reads in the database
            query = query.limit(storeState.articleOverviewState.limit);
            break;
          case LoadMode.forward:
            // order by creation date
            query = query.orderBy('created', 'desc');
            query = query
              .startAfter(storeState.articleOverviewState.pageLast.created)
              .limit(storeState.articleOverviewState.limit);
            break;
          case LoadMode.backwards:
            // order by creation date
            query = query.orderBy('created', 'desc');
            query = query
              .endBefore(storeState.articleOverviewState.pageFirst.created)
              .limitToLast(storeState.articleOverviewState.limit);
            break;
        }
        return query;
      })
      .snapshotChanges()
      .pipe(
        map(convertMany),
        map((data) => {
          return {
            type: '[article endpoint] articles loaded successfully',
            articles: data,
            pageFirst: data[0],
            pageLast: data[data.length - 1],
          };
        }),
        // merge it with the query of the data length and the data itself
        switchMap((res) => {
          if (storeState.search.searchStrings.length > 0) {
            return merge(of({ type: '[article endpoint] data length loaded', dataLength: res.articles.length }), of(res));
          } else {
            return merge(
              this.firestore
                .collection('meta')
                .doc('articles')
                .get()
                .pipe(map((doc) => ({ type: '[article endpoint] data length loaded', dataLength: doc.data().amount }))),
              of(res)
            );
          }
        })
      );
  }

  constructor(private actions$: Actions, private firestore: AngularFirestore, private store: Store<AppStore>) {}
}

function convertMany(action: DocumentChangeAction<StoreableArticle>[]): AppArticle[] {
  // convert all snapshots to data
  let result = action.map((a) => convertSnapshot(a.payload.doc));
  // filter out the 'null' elements if there are some
  result = result.filter((val) => !!val);
  return result;
}

function convertSnapshot(
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
