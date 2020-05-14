import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, take, filter, tap } from 'rxjs/operators';

import { INIT } from '@ngrx/store';
import { AngularFireAuth } from '@angular/fire/auth';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { mapToArray } from '../utils/converters';

interface StoreablePerson {
  groups: { [key: string]: boolean };
  isConfirmedMember: boolean;
  name: string;
}

@Injectable()
export class AuthEffects {
  initPerson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(INIT),
      mergeMap(() =>
        this.auth.authState.pipe(
          // only take the first state change of the firebase auth service
          take(1),
          // filter out empty users
          filter((user) => !!user),
          mergeMap((user) => this.firestore.collection<StoreablePerson>('persons').doc<StoreablePerson>(user.uid).get()),
          // filter out empty persons
          filter((personDoc) => personDoc.exists),
          // map to an AppPerson
          map((personDocument) => ({
            id: personDocument.id,
            name: personDocument.data().name,
            isConfirmedMember: personDocument.data().isConfirmedMemberm,
            groups: mapToArray(personDocument.data().groups),
          })),
          tap((el) => console.log(el)),
          map((person) => ({ type: '[Auth Endpoint] person login successful', person })),
          catchError((error) => of({ type: '[Auth Endpoint] login failed', error }))
        )
      )
    )
  );

  constructor(private actions$: Actions, private auth: AngularFireAuth, private firestore: AngularFirestore) {}
}
