import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { State } from '@state/state.module';
import { Store } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { PageActions, PageActionTypes } from '@state/pagination/actions/page.actions';
import { withLatestFrom, switchMap, map, takeUntil, catchError, filter } from 'rxjs/operators';
import 'firebase/firestore';
import { StoreableArticle } from '@utils/interfaces';
import { SubscriptionService } from '@services/subscription.service';
import { convertMany } from '@utils/converters/article-documents';
import { Query, CollectionReference } from '@angular/fire/firestore/interfaces';
import { of } from 'rxjs';
import { MissingDocumentError } from '@utils/errors/missing-document-error';
import {
  ArticleActionTypes,
  LoadArticlePageFailure,
  LoadArticleAmountSuccess,
  LoadArticleAmountFailure,
  LoadArticleAmount,
  ArticleActions,
  LoadArticlePageSuccess,
  LoadArticleSelectionSuccess,
  LoadArticleSelectionFailure,
} from '../actions/article.actions';
import { sortByTags } from '@utils/converters/sort-by-tags';

@Injectable()
export class ArticleMultiEffects {
  @Effect()
  loadArticles$ = this.actions$.pipe(
    ofType(ArticleActionTypes.LoadArticlePage),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) =>
      this.firestore
        .collection<StoreableArticle>('articles', (qFn) => {
          let query: Query | CollectionReference = qFn;
          // sort the data for pagination
          query = query.orderBy('created', 'desc');
          if (storeState.articles.pageFirst) {
            query = query.startAt(storeState.articles.pageFirst.created);
          }
          query = query.limit(action.payload.limit);
          return query;
        })
        .snapshotChanges()
        .pipe(
          map(convertMany),
          // dispatch loaded event and start loading the article amount
          switchMap((articles) => [new LoadArticlePageSuccess({ articles }), new LoadArticleAmount()]),
          takeUntil(this.subs.unsubscribe$),
          catchError((error) => of(new LoadArticlePageFailure({ error })))
        )
    )
  );

  @Effect()
  loadArticleAmount$ = this.actions$.pipe(
    ofType(ArticleActionTypes.LoadArticleAmount),
    switchMap(() =>
      this.firestore
        .collection('meta')
        .doc('articles')
        .snapshotChanges()
        .pipe(
          map((doc) => {
            // if there is no connection an empty document is returned
            if (doc.payload.exists) {
              return new LoadArticleAmountSuccess({ amount: (doc.payload.data() as any).amount });
            } else {
              return new LoadArticleAmountFailure({ error: new MissingDocumentError('Document meta/articles does not exist') });
            }
          }),
          takeUntil(this.subs.unsubscribe$),
          catchError((error) => of(new LoadArticleAmountFailure({ error })))
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
          qFn.orderBy('created', 'desc').startAfter(storeState.articles.pageLast.created).limit(storeState.articles.pageLimit)
        )
        .snapshotChanges()
        .pipe(
          takeUntil(this.subs.unsubscribe$),
          map(convertMany),
          map((articles) => new LoadArticlePageSuccess({ articles })),
          catchError((error) => of(new LoadArticlePageFailure({ error })))
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
            .endBefore(storeState.articles.pageFirst.created)
            .limitToLast(storeState.articles.pageLimit)
        )
        .snapshotChanges()
        .pipe(
          takeUntil(this.subs.unsubscribe$),
          map(convertMany),
          map((articles) => new LoadArticlePageSuccess({ articles })),
          catchError((error) => of(new LoadArticlePageFailure({ error })))
        )
    )
  );

  @Effect()
  articleSelection$ = this.actions$.pipe(
    ofType(ArticleActionTypes.LoadArticleSelection),
    switchMap((action) =>
      this.firestore
        .collection('articles', (qFn) => {
          let query: CollectionReference | Query = qFn;
          // filter by the search strings
          action.payload.tags.forEach((searchString) => (query = query.where(`tags.${searchString}`, '==', true)));
          return query;
        })
        .snapshotChanges()
        .pipe(
          takeUntil(this.subs.unsubscribe$),
          map(convertMany),
          map(sortByTags),
          map((articles) => articles.slice(0, action.payload.limit)),
          map((articles) => new LoadArticleSelectionSuccess({ articles })),
          catchError((error) => of(new LoadArticleSelectionFailure({ error })))
        )
    )
  );

  constructor(
    private actions$: Actions<ArticleActions | PageActions>,
    private store: Store<State>,
    private firestore: AngularFirestore,
    private subs: SubscriptionService
  ) {}
}
