import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, withLatestFrom, switchMap, takeUntil, filter } from 'rxjs/operators';
import { EMPTY, of, merge } from 'rxjs';
import {
  LoadImagesFailure,
  LoadImagesSuccess,
  ImageActionTypes,
  ImageActions,
  LoadLengthSuccess,
  LoadLengthFailure,
} from '../actions/image.actions';
import { PageActions, PageActionTypes } from '@state/pagination/actions/page.actions';
import { Store } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { SubscriptionService } from '@services/subscription.service';
import { State } from '../reducers/image.reducer';
import 'firebase/firestore';
import { convertMany } from '@utils/converters/image-documents';

@Injectable()
export class ImageEffects {
  @Effect()
  loadImages$ = this.actions$.pipe(
    ofType(ImageActionTypes.LoadImages),
    switchMap((action) =>
      merge(
        this.firestore
          .collection('images', (qFn) => qFn.orderBy('created', 'desc').limit(action.payload.limit))
          .snapshotChanges()
          .pipe(
            map(convertMany),
            map((images) => new LoadImagesSuccess({ images })),
            takeUntil(this.subs.unsubscribe$),
            catchError((error) => of(new LoadImagesFailure({ error })))
          ),
        this.firestore
          .collection('meta')
          .doc('images')
          .snapshotChanges()
          .pipe(
            map((doc) => new LoadLengthSuccess({ length: (doc.payload.data() as any).amount })),
            catchError((error) => of(new LoadLengthFailure({ error })))
          )
      )
    )
  );

  @Effect()
  pageForward$ = this.actions$.pipe(
    ofType(PageActionTypes.PageForward),
    withLatestFrom(this.store),
    filter(([action, storeState]) => storeState.router.state.url.includes('images/overview')),
    switchMap(([action, storeState]) =>
      this.firestore
        .collection('images', (qFn) =>
          qFn
            .orderBy('created', 'desc')
            .startAfter(storeState.imageOverview.pageLast.created)
            .limit(storeState.imageOverview.limit)
        )
        .snapshotChanges()
        .pipe(
          map(convertMany),
          map((images) => new LoadImagesSuccess({ images })),
          takeUntil(this.subs.unsubscribe$),
          catchError((error) => of(new LoadImagesFailure({ error })))
        )
    )
  );

  @Effect()
  pageBackwards$ = this.actions$.pipe(
    ofType(PageActionTypes.PageBackwards),
    withLatestFrom(this.store),
    filter(([action, storeState]) => storeState.router.state.url.includes('images/overview')),
    switchMap(([action, storeState]) =>
      this.firestore
        .collection('images', (qFn) =>
          qFn
            .orderBy('created', 'desc')
            .endBefore(storeState.imageOverview.pageFirst.created)
            .limitToLast(storeState.imageOverview.limit)
        )
        .snapshotChanges()
        .pipe(
          map(convertMany),
          map((images) => new LoadImagesSuccess({ images })),
          takeUntil(this.subs.unsubscribe$),
          catchError((error) => of(new LoadImagesFailure({ error })))
        )
    )
  );

  constructor(
    private actions$: Actions<ImageActions | PageActions>,
    private store: Store<State>,
    private firestore: AngularFirestore,
    private subs: SubscriptionService
  ) {}
}
