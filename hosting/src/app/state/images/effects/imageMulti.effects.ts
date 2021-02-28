import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom, switchMap, takeUntil, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  ImageActionTypes,
  ImageActions,
  LoadImagePageSuccess,
  LoadImagePageFailure,
  LoadImageAmountSuccess,
  LoadImageAmountFailure,
  LoadImageAmount,
} from '../actions/image.actions';
import { PageActions, PageActionTypes } from '@state/pagination/actions/page.actions';
import { Store } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { SubscriptionService } from '@services/subscription.service';
import { State } from '../reducers/image.reducer';
import 'firebase/firestore';
import { convertMany } from '@utils/converters/image-documents';
import { MissingDocumentError } from '@utils/errors/missing-document-error';

@Injectable()
export class ImageMultiEffects {
  @Effect()
  loadImages$ = this.actions$.pipe(
    ofType(ImageActionTypes.LoadImagePage),
    switchMap((action) =>
      this.firestore
        .collection('images', (qFn) => qFn.orderBy('created', 'desc').limit(action.payload.limit))
        .snapshotChanges()
        .pipe(
          map(convertMany),
          // dispatch loaded event and start loading the image amount
          switchMap((images) => [new LoadImagePageSuccess({ images }), new LoadImageAmount()]),
          takeUntil(this.subs.unsubscribe$),
          catchError((error) => of(new LoadImagePageFailure({ error })))
        )
    )
  );

  @Effect()
  loadImageAmount$ = this.actions$.pipe(
    ofType(ImageActionTypes.LoadImageAmount),
    switchMap(() =>
      this.firestore
        .collection('meta')
        .doc('images')
        .snapshotChanges()
        .pipe(
          map((doc) => {
            // if there is no connection an empty document is returned
            if (doc.payload.exists) {
              return new LoadImageAmountSuccess({ amount: (doc.payload.data() as any).amount });
            } else {
              return new LoadImageAmountFailure({ error: new MissingDocumentError('Document meta/images does not exist') });
            }
          }),
          takeUntil(this.subs.unsubscribe$),
          catchError((error) => of(new LoadImageAmountFailure({ error })))
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
          qFn.orderBy('created', 'desc').startAfter(storeState.image.pageLast.created).limit(storeState.image.pageLimit)
        )
        .snapshotChanges()
        .pipe(
          takeUntil(this.subs.unsubscribe$),
          map(convertMany),
          map((images) => new LoadImagePageSuccess({ images })),
          catchError((error) => of(new LoadImagePageFailure({ error })))
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
          qFn.orderBy('created', 'desc').endBefore(storeState.image.pageFirst.created).limitToLast(storeState.image.pageLimit)
        )
        .snapshotChanges()
        .pipe(
          takeUntil(this.subs.unsubscribe$),
          map(convertMany),
          map((images) => new LoadImagePageSuccess({ images })),
          catchError((error) => of(new LoadImagePageFailure({ error })))
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
