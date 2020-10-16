import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  ImageActionTypes,
  ImageActions,
  CreateImageSuccess,
  CreateImageFailure,
  UpdateImageSuccess,
  UpdateImageFailure,
  DeleteImageSuccess,
  DeleteImageFailure,
} from '../actions/image.actions';
import { switchMap, map, tap, catchError, withLatestFrom, endWith, filter } from 'rxjs/operators';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { toStorableImage } from '@utils/converters/image-documents';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { from, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../reducers/image.reducer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Injectable()
export class ImageEffects {
  @Effect()
  createImage$ = this.actions$.pipe(
    ofType(ImageActionTypes.CreateImage),
    switchMap((action) =>
      // add the image document
      from(this.firestore.collection('images').add(toStorableImage(action.payload.image))).pipe(
        map((doc: any) => doc.id),
        // save the image into the storage at the correct id and map the observable back to the id
        switchMap((id) => from(this.storage.ref(`uploads/${id}`).putString(action.payload.file, 'data_url')).pipe(map(() => id))),
        // navigate to the right editor
        tap((id) => this.router.navigate(['images', 'edit', id])),
        // endWith(new CreateImageSuccess()),
        map(() => new CreateImageSuccess()),
        // report to analytics
        tap(() => this.analytics.logEvent('update_image', { event_category: 'engagement' })),
        tap(() => this.snackbar.open('Gespeichert')),
        catchError((error) => of(new CreateImageFailure({ error })))
      )
    )
  );

  @Effect()
  updateImage$ = this.actions$.pipe(
    ofType(ImageActionTypes.UpdateImage),
    // update the documnet
    switchMap((action) =>
      from(this.firestore.collection('images').doc(action.payload.image.id).update(toStorableImage(action.payload.image))).pipe(
        // update the image if there is one
        switchMap(() => {
          if (action.payload.file) {
            return this.storage.ref(`uploads/${action.payload.image.id}`).putString(action.payload.file, 'data_url');
          } else {
            return of(true);
          }
        }),
        map(() => new UpdateImageSuccess()),
        // report to analytics
        tap(() => this.analytics.logEvent('update_image', { event_category: 'engagement' })),
        tap(() => this.snackbar.open('Gespeichert')),
        catchError((error) => of(new UpdateImageFailure({ error })))
      )
    )
  );

  @Effect()
  deleteImag$ = this.actions$.pipe(
    ofType(ImageActionTypes.DeleteImage),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) =>
      from(this.firestore.collection('images').doc(storeState.router.state.params.id).delete()).pipe(
        tap(() => this.router.navigate(['images', 'overview'])),
        map(() => new DeleteImageSuccess()),
        // report to analytics
        tap(() => this.analytics.logEvent('update_image', { event_category: 'engagement' })),
        tap(() => this.snackbar.open('Gelöscht')),
        catchError((error) => of(new DeleteImageFailure({ error })))
      )
    )
  );

  constructor(
    private actions$: Actions<ImageActions>,
    private firestore: AngularFirestore,
    private analytics: AngularFireAnalytics,
    private router: Router,
    private store: Store<State>,
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar
  ) {}
}
