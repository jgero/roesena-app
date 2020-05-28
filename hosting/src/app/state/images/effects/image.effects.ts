import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { LoadImagesFailure, LoadImagesSuccess, ImageActionTypes, ImageActions } from '../actions/image.actions';




@Injectable()
export class ImageEffects {

  @Effect()
  loadImages$ = this.actions$.pipe(
    ofType(ImageActionTypes.LoadImages),
    concatMap(() =>
      /** An EMPTY observable only emits completion. Replace with your own observable API request */
      EMPTY.pipe(
        map(data => new LoadImagesSuccess({ data })),
        catchError(error => of(new LoadImagesFailure({ error }))))
    )
  );



  constructor(private actions$: Actions<ImageActions>) {}

}
