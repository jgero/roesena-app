import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { EMPTY, of, iif } from 'rxjs';
import { LoadUserFailure, LoadUserSuccess, UserActions } from '../actions/user.actions';

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
    switchMap(() =>
      this.auth.authState.pipe(
        switchMap((user) => {
          if (user !== null) {
            // if there is a user logged in get the person from the database
            return this.firestore
              .collection<StoreablePerson>('persons')
              .doc<StoreablePerson>(user.uid)
              .snapshotChanges()
              .pipe(
                map(convertOne),
                map((person) => new LoadUserSuccess({ user: person })),
                catchError((err) => of(new LoadUserFailure(err)))
              );
          } else {
            // if noone is logged-in just send the empty person back
            return of(new LoadUserSuccess({ user: null }));
          }
        })
      )
    )
  );

  constructor(private actions$: Actions<UserActions>, private firestore: AngularFirestore, private auth: AngularFireAuth) {}
}
