import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';
import { PersonActionTypes, PersonActions, LoadUserSuccess, LoadUserFailure } from '../actions/person.actions';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { convertOne } from '@utils/converters/person-documents';
import { StoreablePerson } from '@utils/interfaces';

@Injectable()
export class PersonSingleEffects {
  @Effect()
  loadUser$ = this.actions$.pipe(
    ofType(PersonActionTypes.LoadUser),
    // stay subscribed until logout action is done
    takeUntil(this.actions$.pipe(ofType(PersonActionTypes.LogoutSuccess))),
    switchMap((action) =>
      this.firestore
        .collection<StoreablePerson>('persons')
        .doc<StoreablePerson>(action.payload.id)
        .snapshotChanges()
        .pipe(
          map(convertOne),
          map((person) => new LoadUserSuccess({ user: person })),
          catchError((err) => of(new LoadUserFailure(err)))
        )
    )
  );

  constructor(private actions$: Actions<PersonActions>, private firestore: AngularFirestore) {}
}
