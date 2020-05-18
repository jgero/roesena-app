import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, withLatestFrom, filter, switchMap, tap } from 'rxjs/operators';
import { EMPTY, of, Observable, merge } from 'rxjs';
import {
  LoadArticlesFailure,
  LoadArticlesSuccess,
  ArticleActionTypes,
  ArticleActions,
  LoadArticles,
  LoadLengthSuccess,
} from '../actions/article.actions';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { convertMany } from '@utils/converters/article-documents';
import { StoreableArticle } from '@utils/interfaces';
import { CollectionReference, Query } from '@angular/fire/firestore/interfaces';
import { AngularFirestore } from '@angular/fire/firestore';
import { State } from '../reducers/article.reducer';

enum LoadMode {
  forward,
  backwards,
  init,
}

@Injectable()
export class ArticleEffects {
  // implement effects here and also add the unsubscribe logic
  @Effect()
  initPage$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATED),
    withLatestFrom(this.store),
    filter(([action, storeState]) => (storeState.router.state.url as string).includes('/articles/overview')),
    map(() => new LoadArticles())
  );

  @Effect()
  loadArticles$ = this.actions$.pipe(
    ofType(ArticleActionTypes.LoadArticles),
    withLatestFrom(this.store),
    tap((el) => console.log(el)),
    switchMap(([action, storeState]) => this.getDocumentStream(storeState, LoadMode.init))
  );
  @Effect()
  pageForward$ = this.actions$.pipe(
    ofType(ArticleActionTypes.PageForward),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) => this.getDocumentStream(storeState, LoadMode.forward))
  );
  @Effect()
  pageBackwards$ = this.actions$.pipe(
    ofType(ArticleActionTypes.PageBackwards),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) => this.getDocumentStream(storeState, LoadMode.backwards))
  );

  private getDocumentStream(storeState: State, direction: LoadMode): Observable<any> {
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
            query = query.limit(storeState.article.limit);
            break;
          case LoadMode.forward:
            // order by creation date
            query = query.orderBy('created', 'desc');
            query = query.startAfter(storeState.article.pageLast.created).limit(storeState.article.limit);
            break;
          case LoadMode.backwards:
            // order by creation date
            query = query.orderBy('created', 'desc');
            query = query.endBefore(storeState.article.pageFirst.created).limitToLast(storeState.article.limit);
            break;
        }
        return query;
      })
      .snapshotChanges()
      .pipe(
        map(convertMany),
        map((data) => new LoadArticlesSuccess({ articles: data, pageFirst: data[0], pageLast: data[data.length - 1] })),
        // merge it with the query of the data length and the data itself
        switchMap((res) => {
          if (storeState.search.searchStrings.length > 0) {
            return merge(of(new LoadLengthSuccess({ dataLength: res.payload.articles.length })), of(res));
          } else {
            return merge(
              this.firestore
                .collection('meta')
                .doc('articles')
                .get()
                .pipe(map((doc) => new LoadLengthSuccess({ dataLength: doc.data().amount }))),
              of(res)
            );
          }
        })
      );
  }

  constructor(private actions$: Actions<ArticleActions>, private store: Store<State>, private firestore: AngularFirestore) {}
}
