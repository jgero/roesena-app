import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap, withLatestFrom, takeUntil } from 'rxjs/operators';
import { ImageActionTypes, ImageActions, LoadImageSuccess, LoadImageFailure } from '../actions/image.actions';
import { Store } from '@ngrx/store';
import { State } from '../reducers/image.reducer';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { of } from 'rxjs';
import { SubscriptionService } from '@services/subscription.service';
import { convertOne } from '@utils/converters/image-documents';

@Injectable()
export class ImageEffects {
  @Effect()
  loadImages$ = this.actions$.pipe(
    ofType(ImageActionTypes.LoadImage),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) => {
      if (storeState.router.state.params.id) {
        return this.firestore
          .collection('images')
          .doc(storeState.router.state.params.id)
          .snapshotChanges()
          .pipe(
            takeUntil(this.subs.unsubscribe$),
            map(convertOne),
            map((image) => new LoadImageSuccess({ image })),
            catchError((error) => of(new LoadImageFailure({ error })))
          );
      } else {
        return of(
          new LoadImageSuccess({
            image: {
              id: '',
              ownerId: storeState.user.user.id,
              ownerName: storeState.user.user.name,
              tags: [],
              created: null,
            },
          })
        );
      }
    })
  );

  constructor(
    private actions$: Actions<ImageActions>,
    private store: Store<State>,
    private firestore: AngularFirestore,
    private subs: SubscriptionService
  ) {}
}
