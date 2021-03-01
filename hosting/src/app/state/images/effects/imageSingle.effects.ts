import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom, takeUntil } from 'rxjs/operators';
import { ImageActionTypes, ImageActions, LoadSingleImageSuccess, LoadSingleImageFailure } from '../actions/image.actions';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { of } from 'rxjs';
import { SubscriptionService } from '@services/subscription.service';
import { convertOne } from '@utils/converters/image-documents';

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
            takeUntil(this.subs.unsubscribe$),
            map(convertOne),
            map((image) => new LoadSingleImageSuccess({ image })),
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
