import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom, takeUntil } from 'rxjs/operators';
import { ImageActionTypes, ImageActions, LoadSingleImageSuccess, LoadSingleImageFailure } from '../actions/image.actions';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { AngularFirestore, Query, CollectionReference } from '@angular/fire/firestore';
import 'firebase/firestore';
import { of } from 'rxjs';
import { SubscriptionService } from '@services/subscription.service';
import { convertOne, convertMany } from '@utils/converters/image-documents';
import { UrlLoaderService } from '@services/url-loader.service';

@Injectable()
export class ImageSingleEffects {
  @Effect()
  loadImages$ = this.actions$.pipe(
    ofType(ImageActionTypes.LoadSingleImage),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) => {
      if (storeState.router.state.params.id) {
        return this.firestore
          .collection('images')
          .doc(storeState.router.state.params.id)
          .snapshotChanges()
          .pipe(
            map(convertOne),
            switchMap((image) =>
              this.urlLoader.getImageURL(image.id, false).pipe(map((fullUrl) => new LoadSingleImageSuccess({ image, fullUrl })))
            ),
            takeUntil(this.subs.unsubscribe$),
            catchError((error) => of(new LoadSingleImageFailure({ error })))
          );
      } else if (action.payload?.tags) {
        return this.firestore
          .collection('images', (qFn) => {
            let query: Query | CollectionReference = qFn;
            // filter to only take images with the requested tags
            action.payload.tags.forEach((tag) => (query = query.where(`tags.${tag}`, '==', true)));
            // only take one
            query = query.limit(1);
            return query;
          })
          .snapshotChanges()
          .pipe(
            map(convertMany),
            switchMap((images) =>
              images.length === 0
                ? of(new LoadSingleImageSuccess({ image: null, fullUrl: '' }))
                : this.urlLoader
                    .getImageURL(images[0].id, false)
                    .pipe(map((fullUrl) => new LoadSingleImageSuccess({ image: images[0], fullUrl })))
            ),
            takeUntil(this.subs.unsubscribe$),
            catchError((error) => of(new LoadSingleImageFailure({ error })))
          );
      } else {
        return of(
          new LoadSingleImageSuccess({
            image: {
              id: '',
              ownerId: storeState.persons.user.id,
              ownerName: storeState.persons.user.name,
              tags: [],
              created: null,
            },
            fullUrl: '',
          })
        );
      }
    })
  );

  constructor(
    private actions$: Actions<ImageActions>,
    private store: Store<State>,
    private firestore: AngularFirestore,
    private subs: SubscriptionService,
    private urlLoader: UrlLoaderService
  ) {}
}
