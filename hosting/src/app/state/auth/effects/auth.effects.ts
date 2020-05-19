import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { concatMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { AuthActionTypes, AuthActions } from '../actions/auth.actions';



@Injectable()
export class AuthEffects {


  @Effect()
  loadAuths$ = this.actions$.pipe(
    ofType(AuthActionTypes.LoadAuths),
    /** An EMPTY observable only emits completion. Replace with your own observable API request */
    concatMap(() => EMPTY)
  );


  constructor(private actions$: Actions<AuthActions>) {}

}
