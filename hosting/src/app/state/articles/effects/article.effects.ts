import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom, switchMap, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  ArticleActionTypes,
  ArticleActions,
  LoadSingleArticleSuccess,
  LoadSingleArticleFailure,
} from '../actions/article.actions';
import { Store } from '@ngrx/store';
import { convertOne as convertOneArticle } from '@utils/converters/article-documents';
import { StoreableArticle, StoreableImage } from '@utils/interfaces';
import { CollectionReference, Query } from '@angular/fire/firestore/interfaces';
import { AngularFirestore } from '@angular/fire/firestore';
import { State } from '../reducers/article.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { convertMany as convertManyImages } from '@utils/converters/image-documents';

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
            takeUntil(this.subs.unsubscribe$),
            map(({ article, image }) => new LoadSingleArticleSuccess({ article, image })),
            // map(({ article, image }) => new LoadSingleArticleFailure({ error: { message: 'this is a bad error' } })),
            catchError((error) => of(new LoadSingleArticleFailure({ error })))
          );
      } else {
        return of(
          new LoadSingleArticleSuccess({
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
          })
        );
      }
    })
  );

  constructor(
    private actions$: Actions<ArticleActions>,
    private store: Store<State>,
    private firestore: AngularFirestore,
    private subs: SubscriptionService
  ) {}
}
