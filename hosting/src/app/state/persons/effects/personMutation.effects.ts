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
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import 'firebase/firestore';
import { convertMany, toStorablePerson } from '@utils/converters/person-documents';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { PageActions, PageActionTypes } from '@state/pagination/actions/page.actions';
import { AngularFireFunctions } from '@angular/fire/functions';
import { CloudFunctionCallError } from '@utils/errors/cloud-function-call-error';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class PersonMutationEffects {
  @Effect()
  confirmPerson$ = this.actions$.pipe(
    ofType(PersonActionTypes.ConfirmPerson),
    switchMap((action) =>
      this.fns
        .httpsCallable(`confirmPerson/${action.payload.id}`)({})
        .pipe(
          // report to analytics
          tap(() => this.analytics.logEvent('confirm_person', { event_category: 'admin-action' })),
          tap(() => this.snackbar.open('Person bestätigt')),
          takeUntil(this.subs.unsubscribe$),
          map(() => new ConfirmPersonSuccess()),
          catchError((error) => of(new ConfirmPersonFailure({ error: new CloudFunctionCallError(error.error) })))
        )
    )
  );

  @Effect()
  deletePerson$ = this.actions$.pipe(
    ofType(PersonActionTypes.DeletePerson),
    switchMap((action) =>
      this.fns
        .httpsCallable(`deletePerson/${action.payload.id}`)({})
        .pipe(
          takeUntil(this.subs.unsubscribe$),
          map(() => new DeletePersonSuccess()),
          // report to analytics
          tap(() => this.analytics.logEvent('delete_person', { event_category: 'admin-action' })),
          tap(() => this.snackbar.open('Person gelöscht')),
          catchError((error) => of(new DeletePersonFailure({ error: new CloudFunctionCallError(error.error) })))
        )
    )
  );

  @Effect()
  addGroup$ = this.actions$.pipe(
    ofType(PersonActionTypes.AddGroup),
    switchMap((action) =>
      this.fns
        .httpsCallable(`editGroups/addGroup`)({ id: action.payload.id, group: action.payload.group })
        .pipe(
          map(() => new AddGroupSuccess()),
          takeUntil(this.subs.unsubscribe$),
          // report to analytics
          tap(() => this.analytics.logEvent('edit_group', { event_category: 'admin-action' })),
          tap(() => this.snackbar.open('Gruppe hinzugefügt')),
          takeUntil(this.subs.unsubscribe$),
          catchError((error) => of(new AddGroupFailure({ error: new CloudFunctionCallError(error.error) })))
        )
    )
  );

  @Effect()
  removeGroup$ = this.actions$.pipe(
    ofType(PersonActionTypes.RemoveGroup),
    switchMap((action) =>
      this.fns
        .httpsCallable(`editGroups/removeGroup`)({ id: action.payload.id, group: action.payload.group })
        .pipe(
          map(() => new RemoveGroupSuccess()),
          takeUntil(this.subs.unsubscribe$),
          // report to analytics
          tap(() => this.analytics.logEvent('edit_group', { event_category: 'admin-action' })),
          tap(() => this.snackbar.open('Gruppe gelöscht')),
          catchError((error) => of(new RemoveGroupFailure({ error: new CloudFunctionCallError(error.error) })))
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
