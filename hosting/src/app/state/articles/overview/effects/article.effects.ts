import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  LoadArticlesFailure,
  LoadArticlesSuccess,
  ArticleActionTypes,
  ArticleOverviewActions,
  LoadLengthSuccess,
  LoadLengthFailure,
} from '../actions/article.actions';
import { State } from '../reducers/article.reducer';
import { Store, StoreRootModule } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { PageActions, PageActionTypes } from '@state/pagination/actions/page.actions';
import { withLatestFrom, switchMap, map, takeUntil, catchError, filter } from 'rxjs/operators';
import 'firebase/firestore';
import { StoreableArticle } from '@utils/interfaces';
import { SubscriptionService } from '@services/subscription.service';
import { convertMany } from '@utils/converters/article-documents';
import { Query, CollectionReference } from '@angular/fire/firestore/interfaces';
import { merge, of } from 'rxjs';
import { MissingDocumentError } from '@utils/errors/missing-document-error';

@Injectable()
export class ArticleEffects {
  @Effect()
  loadArticles$ = this.actions$.pipe(
    ofType(ArticleActionTypes.LoadArticles),
    switchMap((action) =>
      merge(
        this.firestore
          .collection<StoreableArticle>('articles', (qFn) => {
            let query: Query | CollectionReference = qFn;
            // sort the data for pagination if there are no search stirngs
            // both at the same time is not possible, because that would require composite indexes between
            // the search string combination and the date
            query = query.orderBy('created', 'desc');
            // the limit applies in both cases to avoid page getting too slow and do unnecessary reads in the database
            query = query.limit(action.payload.limit);
            return query;
          })
          .snapshotChanges()
          .pipe(
            map(convertMany),
            map((articles) => new LoadArticlesSuccess({ articles })),
            takeUntil(this.subs.unsubscribe$),
            catchError((error) => of(new LoadArticlesFailure({ error })))
          ),
        this.firestore
          .collection('meta')
          .doc('articles')
          .snapshotChanges()
          .pipe(
            map((doc) => {
              // if there is no connection an empty document is returned
              if (doc.payload.exists) {
                return new LoadLengthSuccess({ length: (doc.payload.data() as any).amount });
              } else {
                return new LoadLengthFailure({ error: new MissingDocumentError('Document meta/articles does not exist') });
              }
            }),
            takeUntil(this.subs.unsubscribe$),
            catchError((error) => of(new LoadLengthFailure({ error })))
          )
      )
    )
  );

  @Effect()
  pageForward$ = this.actions$.pipe(
    ofType(PageActionTypes.PageForward),
    withLatestFrom(this.store),
    filter(([action, storeState]) => storeState.router.state.url.includes('articles/overview')),
    switchMap(([action, storeState]) =>
      this.firestore
        .collection('articles', (qFn) =>
          qFn
            .orderBy('created', 'desc')
            .startAfter(storeState.articleOverview.pageLast.created)
            .limit(storeState.articleOverview.limit)
        )
        .snapshotChanges()
        .pipe(
          takeUntil(this.subs.unsubscribe$),
          map(convertMany),
          map((articles) => new LoadArticlesSuccess({ articles })),
          catchError((error) => of(new LoadArticlesFailure({ error })))
        )
    )
  );

  @Effect()
  pageBackwards$ = this.actions$.pipe(
    ofType(PageActionTypes.PageBackwards),
    withLatestFrom(this.store),
    filter(([action, storeState]) => storeState.router.state.url.includes('articles/overview')),
    switchMap(([action, storeState]) =>
      this.firestore
        .collection('articles', (qFn) =>
          qFn
            .orderBy('created', 'desc')
            .endBefore(storeState.articleOverview.pageFirst.created)
            .limitToLast(storeState.articleOverview.limit)
        )
        .snapshotChanges()
        .pipe(
          takeUntil(this.subs.unsubscribe$),
          map(convertMany),
          map((articles) => new LoadArticlesSuccess({ articles })),
          catchError((error) => of(new LoadArticlesFailure({ error })))
        )
    )
  );

  constructor(
    private actions$: Actions<ArticleOverviewActions | PageActions>,
    private store: Store<State>,
    private firestore: AngularFirestore,
    private subs: SubscriptionService
  ) {}
}
