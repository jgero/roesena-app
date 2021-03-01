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
import { State } from '@state/state.module';
import { SubscriptionService } from '@services/subscription.service';
import { convertMany as convertManyImages } from '@utils/converters/image-documents';
import { UrlLoaderService } from '@services/url-loader.service';

@Injectable()
export class ArticleSingleEffects {
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
                    // load the image URL of the first image
                    switchMap((images) => (images.length > 0 ? this.urlLoader.getImageURL(images[0].id) : of(''))),
                    // map the article back to the observable
                    map((imageUrl) => ({ article, imageUrl }))
                  );
              } else {
                return of({ article, imageUrl: '' });
              }
            }),
            // only listen until the module gets changed
            takeUntil(this.subs.unsubscribe$),
            map(({ article, imageUrl }) => new LoadSingleArticleSuccess({ article, imageUrl })),
            catchError((error) => of(new LoadSingleArticleFailure({ error })))
          );
      } else {
        return of(
          new LoadSingleArticleSuccess({
            article: {
              id: '',
              ownerId: storeState.persons.user.id,
              ownerName: storeState.persons.user.name,
              tags: [],
              title: '',
              content: '',
              created: new Date(),
            },
            imageUrl: '',
          })
        );
      }
    })
  );

  constructor(
    private actions$: Actions<ArticleActions>,
    private store: Store<State>,
    private urlLoader: UrlLoaderService,
    private firestore: AngularFirestore,
    private subs: SubscriptionService
  ) {}
}
