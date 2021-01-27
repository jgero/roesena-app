import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom, switchMap, takeUntil } from 'rxjs/operators';
import { of, merge } from 'rxjs';
import {
  ContentActions,
  ContentActionTypes,
  LoadArticleSuccess,
  LoadArtcileFailure,
  LoadImageFailure,
  LoadImageSuccess,
} from '../actions/content.actions';
import { Store } from '@ngrx/store';
import { State } from '../reducers/content.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { StoreableArticle, StoreableImage } from '@utils/interfaces';
import { convertMany as convertManyArticles } from '@utils/converters/article-documents';
import { convertMany as convertManyImages } from '@utils/converters/image-documents';
import { UrlLoaderService } from '@services/url-loader.service';

@Injectable()
export class ContentEffects {
  @Effect()
  loadArticle$ = this.actions$.pipe(
    ofType(ContentActionTypes.LoadContent),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) => {
      const groupName = storeState.router.state.data.groupName;
      // first get the article
      return merge(
        this.firestore
          .collection<StoreableArticle>('articles', (qFn) =>
            qFn.where('tags.Gruppenseite', '==', true).where(`tags.${groupName}`, '==', true).limit(1)
          )
          .snapshotChanges()
          .pipe(
            map(convertManyArticles),
            map((articles) => new LoadArticleSuccess({ article: articles[0] })),
            takeUntil(this.subs.unsubscribe$),
            catchError((error) => of(new LoadArtcileFailure({ error })))
          ),
        this.firestore
          .collection<StoreableImage>('images', (qFn) =>
            qFn.where('tags.Gruppenseite', '==', true).where(`tags.${groupName}`, '==', true).limit(1)
          )
          .snapshotChanges()
          .pipe(
            map(convertManyImages),
            // load the image URL of the first image
            switchMap((images) => (images.length > 0 ? this.urlLoader.getImageURL(images[0].id) : of(''))),
            map((imageUrl) => new LoadImageSuccess({ imageUrl })),
            takeUntil(this.subs.unsubscribe$),
            catchError((error) => of(new LoadImageFailure({ error })))
          )
      );
    })
  );

  constructor(
    private actions$: Actions<ContentActions>,
    private store: Store<State>,
    private subs: SubscriptionService,
    private firestore: AngularFirestore,
    private urlLoader: UrlLoaderService
  ) {}
}
