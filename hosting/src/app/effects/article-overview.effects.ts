import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, merge } from 'rxjs';
import { map, mergeMap, catchError, tap, withLatestFrom, filter, switchMap } from 'rxjs/operators';
import 'firebase/firestore';

import { ArticleDalService } from '../services/DAL/article-dal.service';
import * as articleOverveiwActions from '../actions/article-overview.actions';
import * as searchActions from '../actions/search.actions';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { AppStore } from '../reducers';
import { Store } from '@ngrx/store';
import { Direction } from '../utils/enums';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreableArticle, AppArticle } from 'src/app/utils/interfaces';
import {
  CollectionReference,
  Query,
  DocumentChangeAction,
  QueryDocumentSnapshot,
  DocumentSnapshot,
} from '@angular/fire/firestore/interfaces';
import { mapToArray } from '../utils/converters';

@Injectable()
export class ArticleOverviewEffects {
  // loadAricles$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(searchActions.search),
  //     withLatestFrom(this.store),
  //     switchMap(([action, storeState]) =>
  //       this.articleDAO.getBySearchStrings(storeState.search.searchStrings).pipe(
  //         map((articles) => ({ type: '[article endpoint] articles loaded successfully', articles })),
  //         catchError((error) => of({ type: '[article endpoint] articles could not be loaded', error }))
  //       )
  //     )
  //   )
  // );

  initPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(articleOverveiwActions.init),
      withLatestFrom(this.store),
      switchMap(([action, storeState]) =>
        merge(
          this.firestore
            .collection('meta')
            .doc('articles')
            .snapshotChanges()
            .pipe(
              map((el) => ({ type: '[article endpoint] data length loaded', dataLength: (el.payload.data() as any).amount }))
            ),
          this.firestore
            .collection<StoreableArticle>('articles', (qFn) => {
              let query: CollectionReference | Query = qFn;
              // always order by creation date
              query = query.orderBy('created', 'desc');
              // add the search constraints here
              // paginate the data
              if (storeState.articleOverviewState.pageIndex === 0) {
                // when on page 0 the data has to be initialized
                query = query.limit(storeState.articleOverviewState.limit);
                return query;
              } else {
                // otherwise restore the leftover state
                query = query.startAfter(storeState.articleOverviewState.pageFirst).limit(storeState.articleOverviewState.limit);
              }
            })
            .snapshotChanges()
            .pipe(
              map((el) => ({
                type: '[article endpoint] articles loaded successfully',
                articles: convertMany(el),
                // the host of undefined error gets thrown here
                pageFirst: el[0].payload.doc,
                pageLast: el[el.length - 1].payload.doc,
              }))
            )
        )
      )
    )
  );

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
