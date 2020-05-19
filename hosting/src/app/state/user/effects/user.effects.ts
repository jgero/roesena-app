import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { catchError, map, concatMap, mergeMap, switchMap } from 'rxjs/operators';
import { EMPTY, of, iif } from 'rxjs';
import { LoadUserFailure, LoadUserSuccess, UserActionTypes, UserActions } from '../actions/user.actions';

import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { StoreablePerson } from '@utils/interfaces';
import { convertOne } from '@utils/converters/person-documents';

@Injectable()
export class UserEffects {
  @Effect()
  initPerson$ = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    mergeMap(() =>
      this.auth.authState.pipe(
        switchMap((user) =>
          iif(
            () => !!user,
            // if there is a user logged in get the person from the database
            this.firestore
              .collection<StoreablePerson>('persons')
              .doc<StoreablePerson>(user.uid)
              .snapshotChanges()
              .pipe(
                map(convertOne),
                map((person) => new LoadUserSuccess({ user: person }))
              ),
            // if noone is logged-in just send the empty person back
            of(new LoadUserSuccess(null))
          )
        )
      )
    ),
    catchError((err) => of(new LoadUserFailure(err)))
  );

  constructor(private actions$: Actions<UserActions>, private firestore: AngularFirestore, private auth: AngularFireAuth) {}
}
