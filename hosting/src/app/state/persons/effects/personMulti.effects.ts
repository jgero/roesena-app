import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, mergeMap, switchMap, takeUntil, withLatestFrom, tap, filter } from 'rxjs/operators';
import { EMPTY, of, merge, from } from 'rxjs';
import {
  LoadPersonsFailure,
  LoadPersonsSuccess,
  PersonActionTypes,
  PersonActions,
  LoadPersonAmount,
  LoadPersonAmountSuccess,
  LoadPersonAmountFailure,
  DeletePersonSuccess,
  DeletePersonFailure,
  AddGroupSuccess,
  AddGroupFailure,
  RemoveGroupSuccess,
  RemoveGroupFailure,
  ConfirmPersonSuccess,
  ConfirmPersonFailure,
} from '../actions/person.actions';
import { SubscriptionService } from '@services/subscription.service';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';
import undefined from 'firebase/compat/firestore';
import { convertMany, toStorablePerson } from '@utils/converters/person-documents';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { PageActions, PageActionTypes } from '@state/pagination/actions/page.actions';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { CloudFunctionCallError } from '@utils/errors/cloud-function-call-error';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class PersonMultiEffects {
  @Effect()
  loadPersons$ = this.actions$.pipe(
    ofType(PersonActionTypes.LoadPersons),
    switchMap((action) =>
      this.firestore
        .collection('persons', (qFn) => {
          let query: Query | CollectionReference = qFn;
          query = qFn.orderBy('name');
          if (action.payload.onlyUnconfirmed) {
            query = query.where('isConfirmedMember', '==', false);
          } else {
            query = query.limit(action.payload.limit);
          }
          return query;
        })
        .snapshotChanges()
        .pipe(
          map(convertMany),
          switchMap((persons) => [new LoadPersonsSuccess({ persons }), new LoadPersonAmount()]),
          catchError((error) => of(new LoadPersonsFailure({ error }))),
          takeUntil(this.subs.unsubscribe$)
        )
    )
  );

  @Effect()
  loadPersonAmount$ = this.actions$.pipe(
    ofType(PersonActionTypes.LoadPersonAmount),
    switchMap((action) =>
      this.firestore
        .collection('meta')
        .doc('persons')
        .snapshotChanges()
        .pipe(
          map((docSnapshot) => (docSnapshot.payload.data() as any).amount),
          map((amount) => new LoadPersonAmountSuccess({ amount })),
          catchError((error) => of(new LoadPersonAmountFailure({ error }))),
          takeUntil(this.subs.unsubscribe$)
        )
    )
  );

  @Effect()
  movePageForward$ = this.actions$.pipe(
    ofType(PageActionTypes.PageForward),
    withLatestFrom(this.store),
    filter(([action, storeState]) => storeState.router.state.url.includes('auth/group-manager')),
    switchMap(([action, storeState]) =>
      this.firestore
        .collection('persons', (qFn) =>
          qFn.orderBy('name').startAfter(storeState.persons.pageLast.name).limit(storeState.persons.limit)
        )
        .snapshotChanges()
        .pipe(
          map(convertMany),
          map((persons) => new LoadPersonsSuccess({ persons })),
          catchError((error) => of(new LoadPersonsFailure({ error }))),
          takeUntil(this.subs.unsubscribe$)
        )
    )
  );

  @Effect()
  movePageBackwards$ = this.actions$.pipe(
    ofType(PageActionTypes.PageBackwards),
    withLatestFrom(this.store),
    filter(([action, storeState]) => storeState.router.state.url.includes('auth/group-manager')),
    switchMap(([action, storeState]) =>
      this.firestore
        .collection('persons', (qFn) =>
          qFn.orderBy('name').endBefore(storeState.persons.pageFirst.name).limitToLast(storeState.persons.limit)
        )
        .snapshotChanges()
        .pipe(
          map(convertMany),
          takeUntil(this.subs.unsubscribe$),
          map((persons) => new LoadPersonsSuccess({ persons })),
          catchError((error) => of(new LoadPersonsFailure({ error })))
        )
    )
  );

  constructor(
    private actions$: Actions<PersonActions | PageActions>,
    private subs: SubscriptionService,
    private snackbar: MatSnackBar,
    private firestore: AngularFirestore,
    private fns: AngularFireFunctions,
    private analytics: AngularFireAnalytics,
    private store: Store<State>
  ) {}
}
