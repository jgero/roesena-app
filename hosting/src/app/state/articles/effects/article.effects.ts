import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, withLatestFrom, filter, switchMap, tap, takeUntil } from 'rxjs/operators';
import { EMPTY, of, Observable, merge, combineLatest } from 'rxjs';
import {
  LoadArticlesSuccess,
  ArticleActionTypes,
  ArticleActions,
  LoadArticles,
  LoadLengthSuccess,
  LoadSingleArticleSuccess,
} from '../actions/article.actions';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { convertMany as convertManyArticles, convertOne as convertOneArticle } from '@utils/converters/article-documents';
import { StoreableArticle, StoreableImage } from '@utils/interfaces';
import { CollectionReference, Query } from '@angular/fire/firestore/interfaces';
import { AngularFirestore } from '@angular/fire/firestore';
import { State } from '../reducers/article.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { convertMany as convertManyImages } from '@utils/converters/image-documents';

enum LoadMode {
  forward,
  backwards,
  init,
}

@Injectable()
export class ArticleEffects {
  @Effect()
  loadArticle$ = this.actions$.pipe(
    ofType(ArticleActionTypes.LoadSingleArticle),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) => {
      const id = storeState.router.state.params.id;
      if (id) {
        // first get the article
        return this.firestore
          .collection<StoreableArticle>('articles')
          .doc(id)
          .snapshotChanges()
          .pipe(
            map(convertOneArticle),
            // then add the image
            switchMap((article) => {
              if (action.payload.withImage) {
                return this.firestore
                  .collection<StoreableImage>('images', (qFn) => {
                    let query: CollectionReference | Query = qFn;
                    article.tags.forEach((tag) => {
                      query = query.where(`tags.${tag}`, '==', true);
                    });
                    query = query.limit(1);
                    return query;
                  })
                  .snapshotChanges()
                  .pipe(
                    map(convertManyImages),
                    map((images) => ({ article, image: images.length > 0 ? images[0] : null }))
                  );
              } else {
                return of({ article, image: null });
              }
            }),
            // only listen until the module gets changed
            takeUntil(this.subs.unsubscribe$)
          );
      } else {
        return of({
          article: {
            id: '',
            ownerId: storeState.user.user.id,
            ownerName: storeState.user.user.name,
            tags: [],
            title: '',
            content: '',
            created: new Date(),
          },
          image: null,
        });
      }
    }),
    map(({ article, image }) => new LoadSingleArticleSuccess({ article, image }))
    // catchError((error) => of(new LoadSingleArticleFailure({ error }))),
  );

  @Effect()
  loadArticles$ = this.actions$.pipe(
    ofType(ArticleActionTypes.LoadArticles),
    withLatestFrom(this.store),
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
        map(convertManyArticles),
        map((data) => new LoadArticlesSuccess({ articles: data })),
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
        }),
        takeUntil(this.subs.unsubscribe$)
      );
  }

  constructor(
    private actions$: Actions<ArticleActions>,
    private store: Store<State>,
    private firestore: AngularFirestore,
    private subs: SubscriptionService
  ) {}
}
